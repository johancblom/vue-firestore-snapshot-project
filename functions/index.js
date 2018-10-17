const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.onUserCreate = functions.auth.user().onCreate(user => {
  console.log("user " + user.email + " was created");
  admin.auth().updateUser(user.uid, {disabled: true});
  admin.firestore().collection('users')
  .doc(user.uid)
          .set({
            level: 'user',
            status: 'disabled'
          }, {merge: true})
          .then(doc => {
            console.log("user profile created");
          })
  return 0;
});

exports.enableUser = functions.https.onCall((data, context) => {
    const uid = data.uid;
    admin.auth().updateUser(uid, {disabled: false})
})

exports.elevateUser = functions.https.onCall((data) => {
  const uid = data.uid;
  admin.auth().setCustomUserClaims(uid, {admin: true})
})