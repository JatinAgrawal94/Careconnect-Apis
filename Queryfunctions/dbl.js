const {initializeApp}=require('firebase/app');
const {getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,browserSessionPersistence}=require('firebase/auth');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_WEB_API_KEY,
    authDomain: process.env.FIREBASE_WEB_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_WEB_DATABASE_URL,
    projectId:process.env.FIREBASE_WEB_PROJECT_ID,
    storageBucket: process.env.FIREBASE_WEB_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_WEB_MESSAGING_SENDER_ID,
    appId:process.env.FIREBASE_WEB_APPID,
    measurementId:process.env.FIREBASE_WEB_MEASUREMENTID  
};
const app=initializeApp(firebaseConfig);
module.exports={getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,browserSessionPersistence};