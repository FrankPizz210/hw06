// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix";

let socket = new Socket("/socket", {params: {token: ""}});

// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("game:1", {});

let state = {
  guess: "",
  guesses: [],
  hints: [],
  name: "",
  game_name: "",
  player: "",
};

let callback = null;

function state_update(st) {
  
  state = st;
  if (callback) {
    callback(st);
  }
}

export function ch_join(cb, game_name) {
  console.log("joining")
  callback = cb;
  callback(state);
  channel = socket.channel("game:" + game_name, {});

  channel.join()
        .receive("ok", state_update)
        .receive("error", resp => { console.log("Unable to join", resp) })

}

export function ch_login(name) {

  channel.push("login", name)
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });

  console.log("Done with login");
}

export function ch_player(player) {
  channel.push("player", player)
         .receive("ok", state_update)
         .receive("error", resp => {console.log("Unable to push", resp)});
}

export function ch_reset() {
  channel.push("reset", {})
         .receive("ok", state_update)
         .receive("error", resp => {console.log("Unable to push", resp)});
}

export function ch_push(guess) {
  channel.push("guess", guess)
    .receive("ok", state_update)
    .receive("error", resp => {console.log("Unable to push", resp)});
}

export function ch_update(text) {
  channel.push("updateGuess", text)
         .receive("ok", state_update)
         .receive("error", resp => {console.log("Unable to push", resp)});
}


channel.on("view", state_update);


export default socket;
