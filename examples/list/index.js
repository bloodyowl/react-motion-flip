/* @flow */
import React, { Component } from "react"
import type { Element as ReactElement } from "react"
import ReactDOM from "react-dom"

import "./index.html"

import FlipMotion from "../../src"

const fakeContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Nunc tempor magna et bibendum dapibus.
  Curabitur et velit auctor sapien commodo congue.
  Aenean id orci ut augue cursus faucibus non at mi.
  Etiam quis turpis euismod, pharetra mi eu, varius enim.
  Fusce quis ipsum posuere, malesuada nulla nec, feugiat neque.
  Ut at est posuere, iaculis mauris sit amet, pulvinar risus.
  Cras scelerisque lectus vel feugiat euismod.
  Donec ut sapien sit amet diam sodales molestie.
  Mauris sed tellus id justo ullamcorper venenatis.
  Vestibulum sit amet nibh tincidunt, vehicula lorem nec, auctor quam.
  Fusce consectetur odio vel neque consectetur, ac posuere nibh imperdiet.
  Integer at ligula vel neque vehicula tempor.
  Suspendisse aliquet orci non sem convallis, a convallis est vehicula.`.split("\n")

class App extends Component<void, Props, State> {
  state: State;
  shuffle: () => void;
  addItem: () => void;
  addItemRandomly: () => void;
  deleteItemRandomly: () => void;
  deleteMultipleItemsRandomly: () => void;
  replaceItemRandomly: () => void;
  constructor(props: Props) {
    super(props)
    this.state = {
      list: [
        { id: "0", content: "Declarative API for FLIP animations" },
        { id: "1", content: "Pass-children as an API" },
        { id: "2", content: "Use react-motion under the hood" },
      ],
    }
    this.shuffle = this.shuffle.bind(this)
    this.addItem = this.addItem.bind(this)
    this.addItemRandomly = this.addItemRandomly.bind(this)
    this.deleteItemRandomly = this.deleteItemRandomly.bind(this)
    this.replaceItemRandomly = this.replaceItemRandomly.bind(this)
    this.deleteMultipleItemsRandomly = this.deleteMultipleItemsRandomly.bind(this)
  }
  shuffle() {
    this.setState(({ list }) => ({
      list: list.concat().sort(() => Math.random() > .5 ? -1 : 1),
    }))
  }
  addItem() {
    this.setState(({ list }) => ({
      list: [...list, { id: String(Math.random()), content: fakeContent[~~(Math.random() * fakeContent.length)] }],
    }))
  }
  addItemRandomly() {
    this.setState(({ list }) => {
      const index = ~~(Math.random() * list.length)
      return {
        list: [
          ...list.slice(0, index),
          { id: String(Math.random()), content: fakeContent[~~(Math.random() * fakeContent.length)] },
          ...list.slice(index)
        ],
      }
    })
  }
  replaceItemRandomly() {
    this.setState(({ list }) => {
      const index = ~~(Math.random() * list.length)
      return {
        list: [
          ...list.slice(0, index),
          { id: String(Math.random()), content: fakeContent[~~(Math.random() * fakeContent.length)] },
          ...list.slice(index + 1)
        ],
      }
    })
  }
  deleteItemRandomly() {
    this.setState(({ list }) => {
      const index = Math.ceil(Math.random() * list.length)
      if(list.length === 1) {
        return { list: [] }
      }
      return {
        list: [
          ...list.slice(0, index),
          ...list.slice(index + 1),
        ],
      }
    })
  }
  deleteMultipleItemsRandomly() {
    this.setState(({ list }) => {
      const index = Math.ceil(Math.random() * list.length)
      if(list.length === 1) {
        return { list: [] }
      }
      return {
        list: [
          ...list.slice(0, index),
          ...list.slice(index + (~~(Math.random() * (list.length - index)))),
        ],
      }
    })
  }
  render(): ReactElement {
    const { list } = this.state
    return (
      <div>
        <button onClick={this.shuffle}>
          Shuffle the list
        </button>
        <button onClick={this.addItem}>
          Append an item
        </button>
        <button onClick={this.addItemRandomly}>
          Add an anywhere
        </button>
        <button onClick={this.deleteItemRandomly}>
          Delete an item
        </button>
        <button onClick={this.deleteMultipleItemsRandomly}>
          Delete multiple items
        </button>
        <button onClick={this.replaceItemRandomly}>
          Replace an item
        </button>
        <FlipMotion
          style={styles.item}
          childStyle={styles.card}
        >
          {list.map((item) =>
            <div key={item.id} style={styles.cardContent}>
              {item.content}
            </div>
          )}
        </FlipMotion>
      </div>
    )
  }
}

type Props = {}

type State = {
  list: Array<{
    content: string,
    id: string,
  }>,
}

const styles = {
  item: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "stretch",
  },
  card: {
    flexBasis: "33.3333%",
    flexGrow: 0,
    flexShrink: 0,
    padding: 10,
    display: "flex",
    flexDirection: "column",
  },
  cardContent: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
    flexGrow: 1,
  },
}

ReactDOM.render(
  <App />,
  document.getElementById("App")
)
