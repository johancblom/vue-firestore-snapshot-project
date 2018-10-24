const functions = require("firebase-functions");
const admin = require('firebase-admin');
const pdfkit = require ('pdfkit');

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

exports.addedTenant = functions.firestore
.document('tenants/{tenantId}')
.onCreate((snap, context) => {
  const myPdfFile = admin.storage().bucket().file('/tenants/'+snap.id+ '.pdf');

  console.log("going into function 3");

  let doc = new pdfkit();

  console.log("going into function 4");

  let stream = doc.pipe(myPdfFile.createWriteStream());

  console.log("going into tenants db");

  admin.firestore().collection('tenants').doc(snap.id).get().then((dc) => {
      console.log(dc.data());
      doc.fontSize(25).text(dc.data().lastName);
    doc.end();
  });
  
  const allTenantsFile = admin.storage().bucket().file('/tenants/allTenants.pdf');

  doc = new pdfkit();

  stream = doc.pipe(allTenantsFile.createWriteStream());

  admin.firestore().collection('tenants').get().then(snap => {
    snap.forEach(tenant => {
      doc.addPage()
      doc.fontSize(25).text(tenant.data().lastName)
    })
    doc.end()
  })


})