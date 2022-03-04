const {initializeApp,cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const CREDENTIALS=JSON.parse(process.env.CREDENTIALS);
initializeApp({
    credential: cert(CREDENTIALS)
  });
const db = getFirestore();
module.exports={db};