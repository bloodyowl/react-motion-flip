import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import raf from "raf";
import { TransitionMotion, spring } from "react-motion";

class FlipMotion extends Component {
  static propTypes = {
    springConfig: PropTypes.shape({
      stiffness: PropTypes.number,
      damping: PropTypes.number,
      precision: PropTypes.number
    }),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ]),
    style: PropTypes.object,
    childStyle: PropTypes.object,
    component: PropTypes.string,
    childComponent: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    childStyle: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      shouldMesure: false,
      previousPosition: null,
      transform: null
    };
    this.children = {};
  }

  getStyles() {
    const { elementsThatWillUnmount, unmountingElements } = this.state;

    // If some elements are unmounting, use previousChildren to be able to add out transition to leaving elements
    const children =
      (unmountingElements && Object.keys(unmountingElements).length) ||
      (elementsThatWillUnmount && Object.keys(elementsThatWillUnmount).length)
        ? this.state.previousChildren
        : this.props.children;

    return Children.map(children, child => {
      return {
        data: child,
        style:
          unmountingElements && unmountingElements[child.key]
            ? {
                x: spring(0, this.props.springConfig),
                y: spring(0, this.props.springConfig),
                opacity: spring(0, this.props.springConfig),
                scale: spring(0.6, this.props.springConfig)
              }
            : {
                x: spring(0, this.props.springConfig),
                y: spring(0, this.props.springConfig),
                ...(this.state.transform && this.state.transform[child.key]
                  ? this.state.transform[child.key]
                  : null),
                opacity: spring(1, this.props.springConfig),
                scale: spring(1, this.props.springConfig)
              },
        key: child.key
      };
    });
  }

  pruneUnmountingElements() {
    // Remove elements that have completed their out transition
    const prunedUnmountingElements = {};

    Object.keys(this.state.unmountingElements || {}).forEach(key => {
      const childEl = this.children[key];
      if (childEl && parseFloat(childEl.style.opacity) !== 0) {
        prunedUnmountingElements[key] = this.state.unmountingElements[key];
      }
    });

    if (!Object.keys(prunedUnmountingElements).length) {
      clearInterval(this.pruneLoop);
    }

    this.setState({ unmountingElements: prunedUnmountingElements });
  }

  componentWillReceiveProps(nextProps) {
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

      Children.forEach(this.props.children, prevChild => {
        // If key is missing in nextKeys and , element is about to unmount. Store dimensions to be able to position absolutely
        if (
          nextKeys.indexOf(prevChild.key) === -1 &&
          nextChildren.length < prevChildren.length
        ) {
          const rect = this.children[prevChild.key].getBoundingClientRect();

          elementsThatWillUnmount[prevChild.key] = {
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

      // As TransitionMotion does not provide a callback on motion end, we need to manually remove the elements that have completed their out transition and are ready to be unmounted
      clearInterval(this.pruneLoop);
      this.pruneLoop = setInterval(
        this.pruneUnmountingElements.bind(this),
        100
      );

      this.setState({
        elementsThatWillUnmount,
        unmountingElements: {},
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
                if (state.previousPosition && state.previousPosition[key]) {
                  acc[key] = {
                    x: state.previousPosition[key].left - nextRect.left,
                    y: state.previousPosition[key].top - nextRect.top
                  };
                }
                return acc;
              }, {}),
              previousPosition: null
            };
          },
          () => {
            if (this.state.transform) {
              this.setState(state => ({
                transform: Object.keys(state.transform).reduce((acc, key) => {
                  acc[key] = {
                    x: spring(0, this.props.springConfig),
                    y: spring(0, this.props.springConfig)
                  };
                  return acc;
                }, {})
              }));
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

  render() {
    const style = this.props.style;
    const childStyle = this.props.childStyle;
    const Component = this.props.component || "div";
    const ChildComponent = this.props.childComponent || "div";
    const elementsThatWillUnmount = this.state.elementsThatWillUnmount || {};
    const unmountingElements = this.state.unmountingElements || {};

    return (
      <TransitionMotion styles={this.getStyles()} willEnter={this.willEnter}>
        {styles => (
          <Component style={style} className={this.props.className}>
            {styles.map(item => {
              const willUnmount =
                this.state.shouldMesure &&
                (elementsThatWillUnmount[item.key] ||
                  unmountingElements[item.key]);
              const isUnMounting = unmountingElements[item.key];
              const unMountingStyles =
                isUnMounting && unmountingElements[item.key].styles;

              return (
                <ChildComponent
                  key={item.key}
                  style={
                    item.style && {
                      ...childStyle,
                      ...unMountingStyles,
                      display: willUnmount ? "none" : childStyle.display,
                      opacity: item.style.opacity,
                      transform: `translate(${item.style.x}px, ${
                        item.style.y
                      }px) scale(${item.style.scale})`,
                      WebkitTransform: `translate(${item.style.x}px, ${
                        item.style.y
                      }px) scale(${item.style.scale})`
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

export default FlipMotion;
