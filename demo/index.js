/* @flow */
import React, { Component } from "react";
import ReactDOM from "react-dom";

import FlipMotion from "../src";

function getColor(index) {
  const colors = ["#ff5e47", "#ffcf47", "#0088ff", "#11c764"];
  return typeof index !== "undefined"
    ? colors[index]
    : colors[Math.floor(Math.random() * colors.length)];
}

function getLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

const styles = {
  item: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: 40
  },
  card: {
    width: 100,
    height: 100,
    flexGrow: 0,
    flexShrink: 0,
    padding: 5
  },
  cardContent: {
    alignItems: "center",
    borderRadius: 5,
    color: "white",
    display: "flex",
    fontSize: "2em",
    height: "100%",
    justifyContent: "center",
    padding: 10
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        { id: "0", content: "A", color: getColor(0) },
        { id: "1", content: "B", color: getColor(1) },
        { id: "2", content: "C", color: getColor(2) }
      ]
    };
    this.shuffle = this.shuffle.bind(this);
    this.addItemRandomly = this.addItemRandomly.bind(this);
    this.deleteItemRandomly = this.deleteItemRandomly.bind(this);
    this.replaceItemRandomly = this.replaceItemRandomly.bind(this);
    this.deleteMultipleItemsRandomly = this.deleteMultipleItemsRandomly.bind(
      this
    );
  }
  shuffle() {
    this.setState(({ list }) => ({
      list: list.concat().sort(() => (Math.random() > 0.5 ? -1 : 1))
    }));
  }
  addItemRandomly() {
    this.setState(({ list }) => {
      const index = ~~(Math.random() * list.length);
      return {
        list: [
          ...list.slice(0, index),
          {
            id: String(Math.random()),
            content: getLetter(),
            color: getColor()
          },
          ...list.slice(index)
        ]
      };
    });
  }
  replaceItemRandomly() {
    this.setState(({ list }) => {
      const index = ~~(Math.random() * list.length);
      return {
        list: [
          ...list.slice(0, index),
          {
            id: String(Math.random()),
            content: getLetter(),
            color: getColor()
          },
          ...list.slice(index + 1)
        ]
      };
    });
  }
  deleteItemRandomly() {
    this.setState(({ list }) => {
      const index = Math.floor(Math.random() * list.length);
      if (list.length === 1) {
        return { list: [] };
      }
      return {
        list: [...list.slice(0, index), ...list.slice(index + 1)]
      };
    });
  }
  deleteMultipleItemsRandomly() {
    this.setState(({ list }) => {
      const index = Math.ceil(Math.random() * list.length);
      if (list.length === 1) {
        return { list: [] };
      }
      return {
        list: [
          ...list.slice(0, index),
          ...list.slice(index + ~~(Math.random() * (list.length - index)))
        ]
      };
    });
  }
  render() {
    const { list } = this.state;
    return (
      <div>
        <h1>FlipMotion</h1>
        <button onClick={this.shuffle}>Shuffle the list</button>
        <button onClick={this.addItemRandomly}>Add an item</button>
        <button onClick={this.deleteItemRandomly}>Delete an item</button>
        <button onClick={this.deleteMultipleItemsRandomly}>
          Delete multiple items
        </button>
        <button onClick={this.replaceItemRandomly}>Replace an item</button>
        <FlipMotion style={styles.item} childStyle={styles.card}>
          {list.map(item => (
            <div
              key={item.id}
              style={Object.assign({}, styles.cardContent, {
                backgroundColor: item.color
              })}
            >
              {item.content}
            </div>
          ))}
        </FlipMotion>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("App"));
