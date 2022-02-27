import React from "react";
import Child from "./Child";
import SmallParent from "./SmallParent";

class Parent extends React.Component {
    static defaultProps = (function () {
        console.log("*** Parent => defaultProps");
    })();

    constructor(props) {
        console.log("*** Parent => constructor");
        super(props);
        this.state = {
            color: "red"
        }
    }

    componentDidMount() {
        console.log("*** Parent => componentDidMount");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("*** Parent => componentDidUpdate");
    }

    componentWillUnmount() {
        console.log("*** Parent => componentWillUnmount");
    }

    componentDidCatch(error, errorInfo) {
        console.log("=======================================")
        console.log("*** Parent => componentDidCatch");
        console.log("error.name : " + error.name);
        console.log("error.message : " + error.message);
    }

    onClickEvent() {
        console.log("=======================================")
        this.setState({
            color: "blue"
        });
    }

    render() {
        // throw new Error("error");
        return <div>
            <button onClick={() => this.onClickEvent()}>Button</button>
            {/*<SmallParent color={this.state.color + "@@@"}/>*/}
            {/*<SmallParent color={this.state.color + "###"}/>*/}
            <Child color={this.state.color + '@@@'}/>
            <Child color={this.state.color + '###'}/>
        </div>
    }

}

export default Parent;