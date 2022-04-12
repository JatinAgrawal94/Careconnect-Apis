const {getAuth,signInWithEmailAndPassword,signOut,createUserWithEmailAndPassword}=require('../dbl');
const auth=getAuth();
var LocalStorage=require('node-localstorage').LocalStorage;
 localStorage = new LocalStorage('./scratch');
const {db}=require('../db');
const { getStatsAndIncreement } = require('./general');

async function signIn(email,password){

    const result=signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        const token=await auth.currentUser.getIdToken(true);
        // localstorage token
        // localStorage.setItem(email,token);
        return {status:1,token:token};
    })
    .catch((error) => {
        const errorMessage = error.message;
        return {status:0,message:errorMessage};
    });
    return result;
}

async function signOutUser(){
    const result=signOut(auth).then(() => {
        return {status:1}
    }).catch((error) => {
        const errorMessage=error.message
         return {status:0,message:errorMessage};
    });
    return result;
}

async function signUpUser(email,password){
    try {
        const result=await createUserWithEmailAndPassword(auth,email,password);
        var token=await result.user.getIdToken(true);
        let userid=await getStatsAndIncreement('patient');
        let docref=await db.collection('users');
        await docref.add({email:email,role:'patient',userid:userid});
        return {result:'success',token:token};
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
module.exports={signIn,signOutUser,signUpUser};