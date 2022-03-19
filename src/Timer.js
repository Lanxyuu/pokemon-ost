import React, {Component} from 'react';

class Timer extends Component {
    constructor(props) { super(props); }

    componentDidMount() {
        if (this.props.stage === "playing") {
            this.myInterval = setInterval(() => {
                var minutes = this.props.minutes;
                var seconds = this.props.seconds;

                if (seconds > 0) {
                    this.props.setSecond(--seconds);
                }

                if (seconds === 0 && minutes !== 0) {
                    this.props.setSecond(59);
                    this.props.setMinute(--minutes);
                }
            }, 1000);
        } else {
            clearInterval(this.myInterval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    render() {
        return (
            <div>
                Time Remaining: <b>{this.props.minutes}:{this.props.seconds < 10 ? `0${this.props.seconds}` : this.props.seconds}</b>
            </div>
        )
    }
}

export default Timer;