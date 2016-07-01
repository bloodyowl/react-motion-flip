# react-motion-flip

> A simple component to naively perform transitions between children changes

![](http://f.cl.ly/items/3S1p2m0W3g1W2A141505/Screen%20Recording%202016-05-31%20at%2012.09%20PM.gif)

## Install

```console
$ npm install --save react-motion-flip
```

## Import

```javascript
// in ES5/commonJS
var ReactMotionFlip = require("react-motion-flip").default
// in ES6
import ReactMotionFlip from "react-motion-flip"
```

## API

### ReactMotionFlip

A component that performs transitions between children states.

The only thing you need to do is passing children. These children **must** have a `key` prop.

#### props

- `element` *(optional)*: `String` the container element (default: `div`)
- `style` *(optional)*: `Object` style of the container element
- `className` *(optional)*: `String` class applied to container element
- `childElement` *(optional)*: `String` the element wrapping each child (default: `div`)
- `childStyle` *(optional)*: `Object` style of the element wrapping each child
- `springConfig` *(optional)* `Object` spring configuration for react-motion ([docs](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig))

#### example

```javascript
// simple usage
<ReactMotionFlip>
  {list.map((item) =>
    <div
      key={item.id}
      style={styles.child}
    >
      {item.text}
    </div>
  })}
</ReactMotionFlip>

// with custom styles on wrappers
<ReactMotionFlip
  style={{ display: "flex" }}
  childStyle={{ flexBasis: 400 }}
>
  {children}
</ReactMotionFlip>

// elements and classes specified
<ReactMotionFlip
  element="ul"
  childElement="li"
  className="container"
>
  {children}
</ReactMotionFlip>
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
