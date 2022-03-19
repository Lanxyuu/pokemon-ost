import React, {Component} from 'react';

class TimeUp extends Component {
    constructor(props) { super(props); }

    componentDidMount() {
        if (this.props.stage !== "end") {
            this.myInterval = setInterval(() => {
                this.props.changeStage("end");
            }, 1500);
        } else {
            clearInterval(this.myInterval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    render () {
        return(
            <div><b>Time's Up!</b></div>
        );
    }
}

export default TimeUp;