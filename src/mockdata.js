let lobbyData = {
  lobbyState: "started", // init=0, started=1, ended=2
  players: {
    adrian: {
      team: 1
    },
    kien: {
      team: 2
    },
    tommy: {
      team: 2
    }
  },
  spymasterRed: "kien",
  spymasterBlue: "tommy",
  deck: "default",
  currentSession: i1uhd129dh120dh2
};

// i1uhd129dh120dh2
const sessionData = {
  currentTurn: 1, // 1 for red, 2 for blue
  cards: [["lee", "boruto"], ["asdf", "zxcv"]],
  cardState: {
    lee: {
      actual: "red",
      hovered: "red"
    },
    boruto: {
      actual: "black"
    },
    asdf: {
      actual: "blue",
      pick: "blue"
    },
    zxcv: {
      actual: "red",
      pick: "red"
    }
  }
};

let hoverState = {};

// deck object
// [ "naruto", "lee", 'one piece"]

// data.players.kien

// data.cardState.boruto
