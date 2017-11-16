/* @flow */
import React, { Component, Children } from "react";
import raf from "raf";
import { TransitionMotion, spring } from "react-motion";

import type { Element as ReactElement } from "react";

class FlipMotion extends Component<void, Props, State> {
  state: State;
  children: { [key: any]: HTMLElement };
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldMesure: false,
      previousPosition: null,
      transform: null
    };
    this.children = {};
  }
  getStyles(): { data: ReactElement, style: { [key: any]: any }, key: any } {
    // If some elements are unmounting, use previousChildren because unmounting elements are no longer present in this.props.children
    const { unmountingElements } = this.state;
    const children =
      unmountingElements && Object.keys(unmountingElements).length
        ? this.state.previousChildren
        : this.props.children;
    console.log(unmountingElements, children);

    return Children.map(children, (child, index) => {
      return {
        data: child,
        style:
          unmountingElements && unmountingElements[child.key]
            ? this.willLeave()
            : {
                x: spring(0),
                y: spring(0),
                ...(this.state.transform && this.state.transform[child.key]
                  ? this.state.transform[child.key]
                  : null),
                opacity: spring(1),
                scale: spring(1)
              },
        key: child.key
      };
    });
  }
  componentWillReceiveProps(nextProps: Props) {
    const prevChildren = Children.toArray(this.props.children);
    const nextChildren = Children.toArray(nextProps.children);
    if (
      nextChildren.some(
        (item, index) =>
          !prevChildren[index] || item.key !== prevChildren[index].key
      ) ||
      prevChildren.length !== nextChildren.length
    ) {
      const elementsThatWillUnmount = {};
      const nextKeys = Children.map(nextProps.children, child => child.key);
      Children.forEach(this.props.children, prev => {
        // If key is missing in nextKeys, element is about to unmount. Store dimensions and set position absolute
        if (nextKeys.indexOf(prev.key) === -1) {
          const rect = this.children[prev.key].getBoundingClientRect();

          elementsThatWillUnmount[prev.key] = {
            styles: {
              height: rect.height,
              width: rect.width,
              left: rect.left,
              top: rect.top,
              position: "absolute"
            }
          };
        }
      });
      this.setState({
        elementsThatWillUnmount,
        unmountingElements: null,
        shouldMesure: true,
        previousChildren: this.props.children,
        previousPosition: Object.keys(this.children).reduce((acc, key) => {
          if (this.children[key]) {
            acc[key] = this.children[key].getBoundingClientRect();
          }
          return acc;
        }, {}),
        transform: null
      });
    }
  }
  componentDidUpdate() {
    if (this.state.shouldMesure) {
      raf(() => {
        this.setState(
          state => {
            return {
              elementsThatWillUnmount: null,
              unmountingElements: state.elementsThatWillUnmount,
              shouldMesure: false,
              transform: Object.keys(this.children).reduce((acc, key) => {
                if (!this.children[key]) {
                  acc[key] = {
                    x: 0,
                    y: 0
                  };
                  return acc;
                }
                const nextRect = this.children[key].getBoundingClientRect();
                if (
                  this.state.previousPosition &&
                  this.state.previousPosition[key]
                ) {
                  acc[key] = {
                    x: this.state.previousPosition[key].left - nextRect.left,
                    y: this.state.previousPosition[key].top - nextRect.top
                  };
                }
                return acc;
              }, {}),
              previousPosition: null
            };
          },
          () => {
            if (this.state.transform) {
              this.setState({
                transform: Object.keys(
                  this.state.transform
                ).reduce((acc, key) => {
                  acc[key] = {
                    x: spring(0, this.props.springConfig),
                    y: spring(0, this.props.springConfig)
                  };
                  return acc;
                }, {})
              });
              this.children = {};
            }
          }
        );
      });
    }
  }
  willEnter() {
    return {
      x: 0,
      y: 0,
      scale: 0.8,
      opacity: 0
    };
  }
  willLeave() {
    return {
      x: spring(0),
      y: spring(0),
      scale: spring(0.8),
      opacity: spring(0)
    };
  }
  render() {
    const style = this.props.style;
    const childStyle = this.props.childStyle;
    const Component = this.props.component || "div";
    const ChildComponent = this.props.childComponent || "div";
    const elementsThatWillUnmount = this.state.elementsThatWillUnmount || {};
    const unmountingElements = this.state.unmountingElements || {};

    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {styles => (
          <Component style={style} className={this.props.className}>
            {styles.map(item => {
              const willUnmount =
                this.state.shouldMesure && elementsThatWillUnmount[item.key];
              const isUnMounting = unmountingElements[item.key];
              const unMountingStyles =
                isUnMounting && unmountingElements[item.key].styles;

              return willUnmount ? null : (
                <ChildComponent
                  key={item.key}
                  style={
                    item.style && {
                      ...childStyle,
                      ...unMountingStyles,
                      opacity: item.style.opacity,
                      transform: `translate(${item.style.x}px, ${item.style
                        .y}px) scale(${item.style.scale})`,
                      WebkitTransform: `translate(${item.style.x}px, ${item
                        .style.y}px) scale(${item.style.scale})`
                    }
                  }
                  ref={c => (this.children[item.key] = c)}
                >
                  {item.data}
                </ChildComponent>
              );
            })}
          </Component>
        )}
      </TransitionMotion>
    );
  }
}

type State = {
  shouldMesure: boolean,
  previousPosition: ?{
    [key: any]: ClientRect
  },
  transform: ?{
    [key: any]: {
      x: number,
      y: number
    }
  }
};

type Props = {
  springConfig?: {
    stiffness?: number,
    damping?: number,
    precision?: number
  },
  children?: any,
  style?: Object,
  childStyle?: Object,
  component?: string | ReactClass,
  childComponent?: string | ReactClass,
  className?: string
};

export default FlipMotion;
