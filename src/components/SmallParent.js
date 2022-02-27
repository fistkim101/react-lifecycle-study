import React from "react";
import Child from "./Child";

class SmallParent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidCatch(error, errorInfo) {
        console.log("=======================================")
        console.log("*** SmallParent => componentDidCatch");
        console.log("error.name : " + error.name);
        console.log("error.message : " + error.message);
    }

    render() {
        return <Child color={this.props.color}/>
    }
}

export default SmallParent;