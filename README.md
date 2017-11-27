# react-flip-motion

> A simple component to naively perform transitions between children changes

> This is a fork of [react-motion-flip](https://github.com/bloodyowl/react-motion-flip), which appears to be abandoned

![flipmotion-loop](https://user-images.githubusercontent.com/13281350/33279420-c25b0856-d39e-11e7-9406-0930aa204655.gif)

## Install

```console
npm install --save react-flip-motion
```

or

```console
yarn add react-flip-motion
```

## Import

```javascript
// in ES5/commonJS
var FlipMotion = require("react-flip-motion").default
// in ES6
import FlipMotion from "react-flip-motion"
```

## API

### FlipMotion

A component that performs transitions between children states.

The only thing you need to do is passing children. These children **must** have a `key` prop.

#### props

- `component` *(optional)*: `String | ReactClass` the container element or component (default: `div`)
- `style` *(optional)*: `Object` style of the container element
- `className` *(optional)*: `String` class applied to container element
- `childComponent` *(optional)*: `String | ReactClass` the element or component wrapping each child (default: `div`)
- `childStyle` *(optional)*: `Object` style of the element wrapping each child
- `springConfig` *(optional)* `Object` spring configuration for react-motion ([docs](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig))

#### example

Simple usage:

```javascript
<FlipMotion>
  {list.map((item) =>
    <div
      key={item.id}
      style={styles.child}
    >
      {item.text}
    </div>
  })}
</FlipMotion>
```

With custom styles on wrappers:

```javascript
<FlipMotion
  style={{ display: "flex" }}
  childStyle={{ flexBasis: 400 }}
>
  {children}
</FlipMotion>
```

Elements and classes specified:

```javascript
<FlipMotion
  component="ul"
  childComponent="li"
  className="container"
>
  {children}
</FlipMotion>
```

## What is FLIP?

**FLIP** is an animation technique from [Paul Lewis](https://twitter.com/aerotwist). It stands for **First**, **Last**, **Invert**, **Play**.

- **First**: At the initial state, measure where elements are
- **Last**: Move elements to where they belong at the end of the animation
- **Invert**: Use CSS transforms to move the elements to their initial positions
- **Play**: Play the animation

This technique presents the advantage to remove the need for complex calculations to guess where the element you animate is going to end up. You just measure a diff.

> You should read the great article explaining the technique on [aerotwist](https://aerotwist.com/blog/flip-your-animations/)

## Why using react-motion?

react-motion provides a great way to configure animations: not with time, but with *physics*. This makes animations really smooth and natural.

> Have a look at [react-motion](https://github.com/chenglou/react-motion/#what-does-this-library-try-to-solve)
