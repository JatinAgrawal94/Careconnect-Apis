const {getAuth,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword}=require('../dbl');
const auth=getAuth();
// var LocalStorage=require('node-localstorage').LocalStorage;
//  localStorage = new LocalStorage('./scratch');
const {db}=require('../db');
const { getStatsAndIncreement } = require('./general');
const axios=require('axios');


// configured for web  
async function signIn(email,password){

    const result=signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        const token=await auth.currentUser.getIdToken(true);
        var refresh_token=auth.currentUser.refreshToken;
        // localstorage token
        // localStorage.setItem(email,token);
        return {status:1,token:token,refresh_token:refresh_token};
    })
    .catch((error) => {
        const errorMessage = error.message;
        return {status:0,message:errorMessage};
    });
    return result;
}

// configured for web
async function signOutUser(){
    const result=signOut(auth).then(() => {
        return {status:1}
    }).catch((error) => {
        const errorMessage=error.message
         return {status:0,message:errorMessage};
    });
    return result;
}

// configured for mobile
async function signUpUser(email,password,name,contact){
    try {
        const result=await createUserWithEmailAndPassword(auth,email,password);
        var token=await result.user.getIdToken(true);
        var refreshToken=result.user.refreshToken;
        let userid=await getStatsAndIncreement('patient');
        let docref=await db.collection('users');
        await docref.add({email:email,role:'patient',userid:userid});
        docref=await db.collection('Patient');
        await docref.add({email:email,name:name,contact:contact});
        return {result:'success',token:token,'refresh_token':refreshToken};
    } catch (error) {
        if (error.code == 'auth/email-already-in-use') {
            return {result:'Email already in use'};
          } else if (error.code == 'auth/invalid-email') {
            return {result:'Invalid email'};
          } else if (error.code == 'auth/weak-password') {
            return {result:'Weak-password'};
          }
    }

}

// beta
async function updateToken(refreshToken){
    try {
        var body={
            grant_type:'refresh_token',
            refresh_token:refreshToken
        };
        var data=await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_WEB_API_KEY}`,body);
        return data.data;
    } catch (error) {
        
        return 0;
    }
}
module.exports={signIn,signOutUser,signUpUser,updateToken};