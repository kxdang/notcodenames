var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyAkZLsZzMHqG_KjHZK7rXaD1PSBjqn8nTY",
  authDomain: "notcodenames.firebaseapp.com",
  databaseURL: "https://notcodenames.firebaseio.com",
  projectId: "notcodenames",
  appId: "1:143750137317:web:9673cc1bfde207fe875b0c"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().signInAnonymously();
}

export const database = firebase.database();
export const auth = firebase.auth();
