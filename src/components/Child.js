import React from "react";

class Child extends React.Component {
    static defaultProps = (function () {
        console.log("*** Child => defaultProps");
    })();

    constructor(props) {
        console.log("*** Child => constructor || " + props.color);
        super(props);
        this.state = {
            color: "green"
        }
    }

    componentDidMount() {
        console.log("*** Child => componentDidMount || " + this.props.color);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // if (nextProps.color === 'blue###') {
        //     throw new Error("error!!!");
        // }

        console.log("*** Child => shouldComponentUpdate");
        console.log("* nextProps : " + nextProps.color)
        console.log("* nextState : " + nextState.color)
        console.log("* nextContext : " + nextContext)
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("*** Child => componentDidUpdate || " + prevProps.color);
    }

    componentWillUnmount() {
        console.log("*** Child => componentWillUnmount || " + this.props.color)
    }

    render() {
        return <div>
            <h1>{this.props.color}</h1>
        </div>;

    }
}

export default Child;
