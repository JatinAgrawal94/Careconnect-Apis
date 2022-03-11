const {initializeApp,cert} = require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore} = require('firebase-admin/firestore');
const CREDENTIALS=JSON.parse(process.env.CREDENTIALS);
initializeApp({
    credential: cert(CREDENTIALS)
  });

const db = getFirestore();
module.exports={db,getAuth};