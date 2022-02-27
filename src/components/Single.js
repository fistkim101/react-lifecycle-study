import React from "react";

class Single extends React.Component {
    static defaultProps = (function () {
        console.log("*** Single => defaultProps");
    })();

    constructor(props) {
        console.log("*** Single => constructor")
        super(props);
    }

    render() {
        return <div></div>
    }
}

export default Single;