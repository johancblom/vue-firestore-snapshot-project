import firebase from 'firebase'
import firestore from 'firebase/firestore';
import auth from 'firebase/auth';

var config = {
  apiKey: "AIzaSyBuglaeobwtj22xNiYPxSO-Hh03bEc0C6I",
  authDomain: "vue-firestore-snapshot-project.firebaseapp.com",
  databaseURL: "https://vue-firestore-snapshot-project.firebaseio.com",
  projectId: "vue-firestore-snapshot-project",
  storageBucket: "",
  messagingSenderId: "868145912693"
};

const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true});

const db = firebaseApp.firestore()
const fireAuth = firebaseApp.auth()
const functions = firebaseApp.functions()

export {
  db as default,
  fireAuth,
  functions
}