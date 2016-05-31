jest
  .disableAutomock()
  .useRealTimers()

const React = require("react")
const ReactFlipMotion = require("..").default
const TransitionMotion = require("react-motion").TransitionMotion
const TestUtils = require("react-addons-test-utils")

describe("ReactFlipMotion", () => {


  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000
  })

  it("should not error", () => {
    expect(() => TestUtils.renderIntoDocument(<ReactFlipMotion><div key={1}/><div key={2}/></ReactFlipMotion>))
      .not.toThrow()
  })

  it("should render children", () => {

    class View extends React.Component {
      render() {
        return (
          <div {...this.props} />
        )
      }
    }

    class TestComponent extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          list: [
            { id: "0", text: "foo" },
            { id: "1", text: "bar" },
          ]
        }
      }
      render() {
        return (
          <ReactFlipMotion>
            {this.state.list.map((item) =>
              <View style={{ height: 10, fontSize: 10 }} key={item.id}>
                {item.text}
              </View>
            )}
          </ReactFlipMotion>
        )
      }
    }

    const testComponent = TestUtils.renderIntoDocument(
      <TestComponent />
    )

    const flipMotion = TestUtils.findRenderedComponentWithType(testComponent, ReactFlipMotion)
    const reactMotion = TestUtils.findRenderedComponentWithType(flipMotion, TransitionMotion)
    const elements = TestUtils.scryRenderedComponentsWithType(reactMotion, View)
    expect(elements.length).toBe(2)

  })


  it("should transition between states", () => {

    class View extends React.Component {
      render() {
        return (
          <div {...this.props} />
        )
      }
    }

    class TestComponent extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          list: [
            { id: "0", text: "foo" },
            { id: "1", text: "bar" },
          ]
        }
      }
      render() {
        return (
          <ReactFlipMotion>
            {this.state.list.map((item) =>
              <View style={{ height: 10, fontSize: 10 }} key={item.id}>
                {item.text}
              </View>
            )}
          </ReactFlipMotion>
        )
      }
    }

    const testComponent = TestUtils.renderIntoDocument(
      <TestComponent />
    )

    const flipMotion = TestUtils.findRenderedComponentWithType(testComponent, ReactFlipMotion)
    const reactMotion = TestUtils.findRenderedComponentWithType(flipMotion, TransitionMotion)
    const elements = TestUtils.scryRenderedComponentsWithType(reactMotion, View)
    expect(elements.length).toBe(2)
    expect(elements[0].props.children).toBe("foo")
    expect(elements[1].props.children).toBe("bar")

    testComponent.setState({
      list: testComponent.state.list.concat().reverse(),
    })

    return new Promise((done) => {
      setTimeout(() => {
        const flipMotion = TestUtils.findRenderedComponentWithType(testComponent, ReactFlipMotion)
        const reactMotion = TestUtils.findRenderedComponentWithType(flipMotion, TransitionMotion)
        const elements = TestUtils.scryRenderedComponentsWithType(reactMotion, View)
        expect(elements.length).toBe(2)
        expect(elements[0].props.children).toBe("bar")
        expect(elements[1].props.children).toBe("foo")
        done()
      }, 50)
    })
  })

})
