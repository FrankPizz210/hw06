import React, { useState, useEffect } from 'react';


import {ch_join, ch_push, ch_login, ch_reset, ch_update, ch_player} from './socket';


function Play({state}) {
  let {name, isWin, guesses, hints, guess} = state;

  // submits a guess if the guess is valid, otherwise shows an alert
  function makeGuess() {
    ch_push(guess);
  }

  function reset() {
    ch_reset();
  }

  // handles keypresses so that hitting enter makes a guess and backspace deletes
  function keyPress(ev) {
    // based off of the react-intro notes
    if (ev.key === "Enter") {
      makeGuess();
    }
  }

  // updates the current guess based on the key pressed
  function updateGuess(ev) {
    let text = ev.target.value;

    if (text.length >= 4) {
      text = text.substring(0, 4);
    }
    ch_update(text);
  }

  // renders when the game is ongoing without an end condition
  return (
    <div className="App">
      <h1>4Digits</h1>
      <h2>Username: {name}</h2>
      <p>
        <input type="number"
               value={guess}
               onChange={updateGuess}
               onKeyPress={keyPress} />

        <button onClick={makeGuess}>
          Make guess
        </button>
      </p>
      <table>
        <tr>
          <td>1.</td>
          <td>{guesses[0]}</td>
          <td>{hints[0]}</td>
        </tr>
        <tr>
          <td>2.</td>
          <td>{guesses[1]}</td>
          <td>{hints[1]}</td>
        </tr>
        <tr>
          <td>3.</td>
          <td>{guesses[2]}</td>
          <td>{hints[2]}</td>
        </tr>
        <tr>
          <td>4.</td>
          <td>{guesses[3]}</td>
          <td>{hints[3]}</td>
        </tr>
        <tr>
          <td>5.</td>
          <td>{guesses[4]}</td>
          <td>{hints[4]}</td>
        </tr>
        <tr>
          <td>6.</td>
          <td>{guesses[5]}</td>
          <td>{hints[5]}</td>
        </tr>
        <tr>
          <td>7.</td>
          <td>{guesses[6]}</td>
          <td>{hints[6]}</td>
        </tr>
        <tr>
          <td>8.</td>
          <td>{guesses[7]}</td>
          <td>{hints[7]}</td>
        </tr>
      </table>

      <p>
        <button onClick={reset}>
          New Game
        </button>
      </p>
    </div>
  );
}

// handles the logging in aspect of the servers
function Login() {
  const [name, setName] = useState("");
  const [game_name, setGameName] = useState("");

  let body = null;

  body = (<div className="row">
    <div className="column">
      <input type="text"
             value={game_name}
             onChange={(ev) => setGameName(ev.target.value)} />
    </div>
    <div className="column">
      <button onClick={() => ch_join(setGameName, game_name)}>Join</button>
    </div>
  </div>);

  return (
    <div className="container">

    <div className="row">
      <div className="column">
      <input type="text"
             value={name}
             onChange={(ev) => setName(ev.target.value)} />

        </div>
        <div className="column">
        <button onClick={() => ch_login(name)}>Login</button>
      </div>
      </div>
      </div>
  );
}

function GameOver({state}) {
  function reset() {
    ch_reset();
  }

    if (state.isWin) {
      return (
        <div className="container">
        <h1>{state.name} Wins!</h1>
        <button onClick={reset}>
          New Game
        </button>
        </div>
      );
    }
    else {
      return (
          <div className="container">
          <h1>{state.name} Loses!</h1>
          <button onClick={reset}>
            New Game
          </button>
          </div>
      );
    }

}

function Player() {
  const [player, setPlayer] = useState("");

  return (
    <div className="row">
      <div className="column">
        <button onClick={() => ch_player("player")}>Player</button>
      </div>
      <div className="column">
        <button onClick={() => ch_player("observer")}>Observer</button>
      </div>
    </div>
  )
}

// 4digits app to run in browser
function Digits() {
  const [state, setState] = useState({
    guesses: [],
    hints: [],
    guess: "",
    name: "",
    player: "",
  });
  
  let {isWin, guesses, hints, guess, name, player} = state;


  useEffect(() => {
    
    ch_join(setState, name);
  }, []);

  let body = null;


  if (state.name === "") {
    body = <Login />
  } else if (state.player === "") {
    body = <Player />

  } else if (!state.isWin && state.guesses.length < 8) {

      body = <Play state={state} />;
  // } else if (state.name === "") {
  //   body = <Login />
  } else {
      body = <GameOver state={state} />;
  }

  return (
    <div className="container">
      {body}
      </div>
  );
}

export default Digits;
