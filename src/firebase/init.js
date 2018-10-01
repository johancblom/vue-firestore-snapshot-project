import firebase from 'firebase'
import firestore from 'firebase/firestore';

var config = {
    apiKey: "AIzaSyDeAGhDmJC3VelkRDnOpikHWewM2LfiXnw",
    authDomain: "fir-project-24de9.firebaseapp.com",
    databaseURL: "https://fir-project-24de9.firebaseio.com",
    projectId: "fir-project-24de9",
    storageBucket: "fir-project-24de9.appspot.com",
    messagingSenderId: "135922222597"
  };

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true});

export default firebaseApp.firestore();