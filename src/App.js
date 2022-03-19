import React from 'react';
import Game from './Game.js';
import Instructions from './Instructions.js';

function Intro(props) {
  return (
    <>
      <h1>Welcome to the Pokemon Battle OST Guessing Game!</h1><br/>
      <div className="intro-text-container">Here, you can test your Pokemon battle soundtrack knowledge with this collection of OSTs from the original Gen 1 games all the way to Legends Arceus. 
      You may encounter different versions of a single theme, so listen carefully!
      Play a timed game to see how many you can get in 2 minutes or play casually with unlimited time.<br/>Enjoy!</div>
      <div className="intro-button-container">
        <button className="intro-button" onClick={() => { props.startGame("casual") }}>CASUAL</button>
        <button className="intro-button" onClick={() => { props.startGame("timed") }}>TIMED</button>
      </div>
      <Instructions />
    </>
  );
}

function Footer() {
  return (
    <footer>
      <>
        Music retrieved from <a href="https://downloads.khinsider.com/"  target="_blank" rel="noopener noreferrer">Khinsider</a>.<br/>
        Images retrieved from <a href="https://archives.bulbagarden.net/wiki/Main_Page" target="_blank" rel="noopener noreferrer">Bulbagarden Archives</a>.<br/>
        Images/Music &copy; Pokemon/Nintendo.<br/>
        Made by Lanxyuu.
      </>
    </footer> 
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: "intro",
    };
    this.startGame = this.startGame.bind(this);
    this.intro = this.intro.bind(this);
  };

  startGame(type) {
    this.setState({
      stage: type,
    });
  }

  intro() {
    this.setState({
      stage: "intro",
    });
  }

  render() {
    if (this.state.stage == "intro") {
      return (
        <>
          <div className="content-container"><Intro startGame={(type) => this.startGame(type)} /></div>
          <Footer/>
        </>
      );
    }
    return (
      <>
        <div className="content-container"><Game intro={this.intro} type={this.state.stage}/></div>
        <Footer/>       
      </>
    );
  }
}

export default App;