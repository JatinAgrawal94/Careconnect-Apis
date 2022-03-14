const {getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,browserSessionPersistence}=require('../dbl');
const auth=getAuth();

async function signIn(email,password){
    const result=signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        return {status:1};
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
    return auth.currentUser;
    // onAuthStateChanged(auth,(user) => {
    //     if (user) {
    //       // User is signed in, see docs for a list of available properties
    //       // https://firebase.google.com/docs/reference/js/firebase.User
    //       next();
    //     } else {
    //         console.log('User is signed out');
    //       // User is signed out
    //       // ...
    //     }
    //   }
    //   );
}

module.exports={signIn,signOutUser,checkLoginStatus};