const admin = require("firebase-admin");
const serviceAccount = require("../../chatapp-ecf75-firebase-adminsdk-f1kns-7b2b8a9948.json");

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// console.log("firebaseAdmin------",firebaseAdmin);
module.exports = firebaseAdmin;