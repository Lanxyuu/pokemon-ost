import React, {useState, useEffect} from "react";
import Instructions from './Instructions.js';
import Timer from './Timer.js';
import TimeUp from './TimeUp.js';
import {Howl} from "howler";
import songs from "./Songs.js";

function Display(props) {
    if (props.stage == "end") {
        const history = props.playHistory.map((song, no) => {
            var colorStyle = (song.status == "Skipped") ? {color: 'rgb(168, 6, 6)'} : {color: 'rgb(5, 77, 9)'};
            return (<li key={no}> {song.songName} (<b><span style={colorStyle}>{song.status}</span></b>)</li>);
        });
        return (
            <div className = "end-container">
                <div>Longest streak: <b>{props.maxStreak}</b> </div>
                <div>Total correct answers: <b>{props.succCounter} out of {props.playHistory.length} ({(props.playHistory.length > 0) ? (Math.round((props.succCounter / props.playHistory.length) * 100)) : "ಠ_ಠ"}%)</b></div>
                <div>Songs played: </div>
                <div className="history-container"><ol>{history}</ol></div>
            </div>
        );
    }
    if (props.minutes === 0 && props.seconds === 0) {
        return (
            <div style={{
                fontSize: "larger",
                color: "rgb(168, 6, 6)"
            }}><TimeUp
            stage={props.stage}
            changeStage={(stage) => props.changeStage(stage)}/></div>
        );
    }
    if (props.stage == "correctAnswer" || props.stage == "skipped") {
        var correct = (props.stage == "correctAnswer") ? "Correct! " : correct = "";
        var timeRem, timeMes = <></>;
        if (props.type == "timed") {
            timeMes = "Time Remaining: "
            timeRem = props.minutes + ":" + ((props.seconds < 10) ? "0" + props.seconds : props.seconds);
            timerStyle = (props.minutes < 1 && props.seconds < 10) ? "timer-red" : "timer";
        }
        var randImg = Math.floor(Math.random() * props.song.imgUrl.length);
        //console.log(props.song.imgUrl[randImg]);
        return (
            <>
                <div className={timerStyle}>{timeMes}<b>{timeRem}</b></div>
                <div className="answer-container">
                    {correct} The answer is: <b>{props.song.label}</b><br/>
                    This soundtrack is: <b>{props.song.fullName[props.ver]}</b>
                </div>
                <div className="char-img-container"><img src={props.song.imgUrl[randImg]} className="character-img"></img></div>
            </>
        );
    }
    
    const timer = (props.type == "timed") ? <Timer
        stage={props.stage}
        minutes={props.minutes}
        seconds={props.seconds}
        changeStage={(stage) => props.changeStage(stage)}
        setMinute={(min) => props.setMinute(min)}
        setSecond={(sec) => props.setSecond(sec)} /> : <></>;
    var message = (props.stage == "playing") ? "Now playing..." : "Wrong!";
    var timerStyle = (props.minutes < 1 && props.seconds < 10) ? "timer-red" : "timer";
    return (
        <>
            <div className={timerStyle}>{timer}</div>
            <div className = "streak">Streak: <b>{props.streak}</b></div>
            <div className="display-message">{message}</div>
        </>
    );
}

function Controls(props) {
    var [hintText, setHintText] = useState("");
    useEffect(() => {
        if(props.stage !== "wrongAnswer" && props.stage !== "playing") {
            setHintText("");
        }
    }, [props.stage]);
    
    if (props.stage == "end") {
        return (<button className="game-button" onClick={() => { props.intro(); }}>PLAY AGAIN!</button>);
    }
    if (props.minutes > 0 || props.seconds > 0) {
        if ((props.stage == "playing" || props.stage == "wrongAnswer")) {
            var boxStyle = (hintText == "") ? {outline: "none"} : {  
                maxWidth: "30%",
                padding: "10px",
                outline: "dashed #2b60c2",
                margin: "0 auto"};
            return (
                <>
                    <div>
                        <input autoFocus type="text" onKeyPress={(ev) => {
                            if (ev.key === "Enter") {
                                ev.preventDefault();
                                props.handleInput(ev.target.value);
                            } else {
                                props.changeStage("playing");
                            }
                        }} />
                    </div>
                    <div>
                        <button className="game-button" onClick={props.skipSong}>SKIP</button>
                        <button className="game-button" onClick={() => { setHintText(`This OST is associated with the ${props.song.region} region.`); }}>HINT</button>
                        <button className="game-button" onClick={() => { props.changeStage("end"); }}>END</button>
                    </div>
                    <div style={boxStyle}>{hintText}</div>
                    <div><Instructions /></div>
                </>
            );
        }
        return (
            <>
                <button className="game-button" autoFocus onClick={() => { setTimeout(props.nextSong(), 250); }}>NEXT</button>
                <button className="game-button" onClick={() => { props.changeStage("end"); }}>END</button>
            </>);
    }
    return (<></>);
}

class Game extends React.Component { 
    rand = Math.floor(Math.random() * songs.length);
    ver = Math.floor(Math.random() * songs[this.rand].fileUrl.length);
    audio = new Howl({
        src: songs[this.rand].fileUrl[this.ver],
        loop: true,
        html5: true,                
    });
    playingSound = false;

    constructor(props) {
        super(props);
        this.state = {
            stage: "playing",
            song: songs[this.rand],
            audio: null,
            streak: 0,
            maxStreak: 0,
            succCounter: 0,
            playHistory: [],
            minutes: 2,
            seconds: 0
        };
        this.handleInput = this.handleInput.bind(this);
        this.changeStage = this.changeStage.bind(this);
        this.setMinute = this.setMinute.bind(this);
        this.setSecond = this.setSecond.bind(this);
    };

    handleInput(answer) {
        //console.log(answer);
        if (this.state.song.answers.includes(answer.toLowerCase())) {
            this.stopSong();

            const succCounter = this.state.succCounter + 1;
            const streak = this.state.streak + 1;
            const maxStreak = (this.state.maxStreak < streak) ? streak : this.state.maxStreak;

            this.setState({
                stage: "correctAnswer",
                streak: streak,
                maxStreak: maxStreak,
                succCounter: succCounter,
                playHistory: this.state.playHistory.concat([{ songName: this.state.song.fullName[this.ver], status: "Correct" }]),
            });

            //console.log(this.state.playHistory);
        } else {
            this.setState({
                stage: "wrongAnswer",
            });
        }
    }

    setMinute(min) {
        this.setState({
            minutes: min,
        });
    }

    setSecond(sec) {
        this.setState({
            seconds: sec,
        });
    }

    changeStage(stage) {
        if (stage == "end") {
            this.audio.stop();
            if (this.state.stage == "playing" || this.state.stage == "wrongAnswer" || (this.props.type == "timed" && this.state.stage != "skipped")) {
                this.setState({
                    playHistory: this.state.playHistory.concat([{ songName: this.state.song.fullName[this.ver], status: "Skipped" }]),
                });
            }
        }
        this.setState({
            stage: stage,
        });
    }

    playSong() {
        //console.log(this.rand + " " + this.ver + " " + this.state.song.fullName[this.ver]);
        this.audio.play();
        this.playingSound = true;
    }

    stopSong() {
        this.audio.stop();
        this.playingSound = false;
    }

    skipSong() {
        this.stopSong();
        this.setState({
            stage: "skipped",
            streak: 0,
            playHistory: this.state.playHistory.concat([{ songName: this.state.song.fullName[this.ver], status: "Skipped" }]),
        });
    }

    nextSong() {
        this.rand = Math.floor(Math.random() * songs.length);
        this.ver = Math.floor(Math.random() * songs[this.rand].fileUrl.length);
        this.audio = new Howl({
            src: songs[this.rand].fileUrl[this.ver],
            loop: true,
            html5: true,                
        })
        this.setState({
            stage: "playing",
            song: songs[this.rand],
        });
    }

    render() {
        if (this.state.stage == "playing" && !this.playingSound) this.playSong();
        return (
            <>
                <div className="display-container"> <Display
                    type={this.props.type}
                    stage={this.state.stage}
                    song={this.state.song}
                    audio={this.audio}
                    streak={this.state.streak}
                    changeStage={(stage) => this.changeStage(stage)}
                    maxStreak={this.state.maxStreak}
                    succCounter={this.state.succCounter}
                    playHistory={this.state.playHistory}
                    minutes={this.state.minutes}
                    seconds={this.state.seconds}
                    setMinute={(min) => this.setMinute(min)}
                    setSecond={(sec) => this.setSecond(sec)}
                    ver={this.ver}
                    stopSong={() => this.stopSong()} /></div>

                <div className="controls-container"> <Controls
                    stage={this.state.stage}
                    handleInput={(answer) => this.handleInput(answer)}
                    changeStage={(stage) => this.changeStage(stage)}
                    skipSong={() => this.skipSong()}
                    nextSong={() => this.nextSong()}
                    intro={() => this.props.intro()}
                    song={this.state.song}
                    minutes={this.state.minutes}
                    seconds={this.state.seconds} /></div>
            </>
        );
    }
}

export default Game;