const { async } = require('@firebase/util');
const {getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,browserSessionPersistence}=require('../dbl');
const auth=getAuth();
var LocalStorage=require('node-localstorage').LocalStorage;
 localStorage = new LocalStorage('./scratch');

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

async function setAuthState(email,password){    
   setPersistence(auth, browserSessionPersistence)
    .then(() => {
        return signIn(auth, email, password);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
   
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


async function checkLoginStatus(){
    // var token=await auth.currentUser.getIdToken(true);
    // console.log(token);
    // localStorage.setItem(auth.currentUser.email,token);
    return auth.currentUser;
}

module.exports={signIn,signOutUser};