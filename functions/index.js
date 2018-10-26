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

  let tenantDoc = new pdfkit({autoFirstPage: false});

  let tenantStream = tenantDoc.pipe(myPdfFile.createWriteStream());

  admin.firestore().collection('tenants').doc(snap.id).get().then((dc) => {
    createInvoice(dc, tenantDoc, endDoc).then(() => {
      tenantDoc.end();
      console.log('doc created');
    })
  })

  endDoc = () => tenantDoc.end()
})

exports.changedTenant = functions.firestore
.document('tenants/{tenantId}')
.onUpdate((change, context) => {
  const newValue = change.after.data();
  console.log(newValue);
  const allTenantsFile = admin.storage().bucket().file('/tenants/allTenants.pdf');
  
  const tenantsDoc = new pdfkit({autoFirstPage: false});
  
  let tenantsStream = tenantsDoc.pipe(allTenantsFile.createWriteStream());
  
  return admin.firestore().collection('tenants').get().then((snap) => {
    let result = snap.docs.map((tenant) => {
      return new Promise((resolve) => createInvoice(tenant, tenantsDoc, resolve))
    })
    Promise.all(result).then(() => {
      tenantsDoc.end()
      console.log("doc created");
    })
  })
})
  
    
function createInvoice(tenant, doc, resolve) {
  const plots = []
  return admin.firestore().collection('plots').where('tenant', '==', tenant.id).get().then(snap => {
    snap.forEach(plot =>{
      console.log('plot.id to be added: ' + plot.id)
      plots.push(plot.id)
    })
    console.log("plots: " + plots.toString())
    doc.addPage({margins: {top: 50, bottom: 50, left: 72, right: 72}})
    doc.fontSize(25).text('Invoice')
    doc.moveTo(70, 100)
    .lineTo(500, 100)
    .stroke()
    doc.fontSize(13)
    doc.x = 70
    doc.y = 120
    doc.text('Name: ')
    doc.x = 120
    doc.y = 120
    doc.text(tenant.data().lastName)
    doc.x = 70
    doc.moveDown
    doc.text('Plots:')
    doc.x = 120
    doc.y = 135
    doc.text(plots.toString())
    resolve()
  },
  () => {
    doc.addPage({margins: {top: 50, bottom: 50, left: 72, right: 72}})
    doc.fontSize(25).text('Invoice')
    doc.moveTo(70, 100)
    .lineTo(500, 100)
    .stroke()
    doc.fontSize(13)
    doc.x = 70
    doc.y = 120
    doc.text('Name: ')
    doc.x = 120
    doc.y = 120
    doc.text(tenant.data().lastName)
    doc.x = 70
    doc.moveDown
    doc.text('Plots:')
    doc.x = 120
    doc.y = 135
    doc.text(plots.map(plot => plot.id).toString())
    resolve()
  })
}