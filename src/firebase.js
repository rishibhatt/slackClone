import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyCD-pYfueltz4441KUvD1o4nLz4Sntrl08",
    authDomain: "react-slack-clone-9a8a0.firebaseapp.com",
    databaseURL: "https://react-slack-clone-9a8a0.firebaseio.com",
    projectId: "react-slack-clone-9a8a0",
    storageBucket: "react-slack-clone-9a8a0.appspot.com",
    messagingSenderId: "436474392456",
    appId: "1:436474392456:web:319692ca51f1e86ed9943d",
    measurementId: "G-866Z6Q158E"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;