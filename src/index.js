/* @flow */
import React, { Component, Children } from "react"
import raf from "raf"
import { TransitionMotion, spring } from "react-motion"

import type { Element as ReactElement } from "react"

class FlipMotion extends Component<void, Props, State> {
  state: State;
  children: { [key: any]: HTMLElement };
  constructor(props: Props) {
    super(props)
    this.state = {
      shouldMesure: false,
      previousPosition: null,
      transform: null,
    }
    this.children = {}
  }
  getStyles(): { data: ReactElement, style: { [key: any]: any }, key: any} {
    const { children } = this.props
    return Children.map(children, (child, index) => {
      return {
        data: child,
        style: {
          x: spring(0),
          y: spring(0),
          ...this.state.transform && this.state.transform[child.key] ? this.state.transform[child.key] : null,
          opacity: spring(1),
          scale: spring(1),
        },
        key: child.key,
      }
    })
  }
  componentWillReceiveProps(nextProps: Props) {
    const prevChildren = Children.toArray(this.props.children)
    const nextChildren = Children.toArray(nextProps.children)
    if(nextChildren.some((item, index) => !prevChildren[index] || item.key !== prevChildren[index].key)) {
      this.setState({
        shouldMesure: true,
        previousPosition: Object.keys(this.children).reduce((acc, key) => {
          if(this.children[key]) {
            acc[key] = this.children[key].getBoundingClientRect()
          }
          return acc
        }, {}),
        transform: null,
      })
    }
  }
  componentDidUpdate() {
    if(this.state.shouldMesure) {
      raf(() => {
        this.setState({
          shouldMesure: false,
          transform: Object.keys(this.children).reduce((acc, key) => {
            if(!this.children[key]) {
              acc[key] = {
                x: 0,
                y: 0,
              }
              return acc
            }
            const nextRect = this.children[key].getBoundingClientRect()
            if(this.state.previousPosition && this.state.previousPosition[key]) {
              acc[key] = {
                x: this.state.previousPosition[key].left - nextRect.left,
                y: this.state.previousPosition[key].top - nextRect.top,
              }
            }
            return acc
          }, {}),
          previousPosition: null,
        }, () => {
          if(this.state.transform) {
            this.setState({
              transform: Object.keys(this.state.transform).reduce((acc, key) => {
                acc[key] = {
                  x: spring(0, this.props.springConfig),
                  y: spring(0, this.props.springConfig),
                }
                return acc
              }, {})
            })
            this.children = {}
          }
        })
      })
    }
  }
  willEnter() {
    return {
      x: 0,
      y: 0,
      scale: 0.8,
      opacity: 0,
    }
  }
  render() {
    const { style, childStyle } = this.props
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
      >
        {(styles) =>
          <div style={style}>
            {styles.map((item) =>
              <div
                key={item.key}
                style={item.style && {
                  ...childStyle,
                  opacity: item.style.opacity,
                  transform: `translate(${ item.style.x }px, ${ item.style.y }px) scale(${ item.style.scale })`,
                  WebkitTransform: `translate(${ item.style.x }px, ${ item.style.y }px) scale(${ item.style.scale })`,
                }}
                ref={(c) => this.children[item.key] = c}
              >
                {item.data}
              </div>
            )}
          </div>
        }
      </TransitionMotion>
    )
  }
}

type State = {
  shouldMesure: boolean,
  previousPosition: ?{
    [key: any]: ClientRect,
  },
  transform: ?{
    [key: any]: {
      x: number,
      y: number,
    },
  },
}

type Props = {
  springConfig?: {
    stiffness?: number,
    damping?: number,
    precision?: number,
  },
  children?: any,
  style?: Object,
  childStyle?: Object,
}

export default FlipMotion
