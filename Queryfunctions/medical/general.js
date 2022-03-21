const {db,getAuth}=require('../db');
// var LocalStorage=require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');
async function getDocsId(email,collection){
    try{
        var data=[];
        const docRef=db.collection(collection);
        const snapshot=await docRef.where('email','==',email).get();
        snapshot.docs.forEach((item)=>{
            data.push({
                'email':item.data()['email'],
                'phoneno':item.data()['phoneno'],
                'userid':item.data()['userid'],
                'documentid':item.id
        });
        });
        return data;
    }catch(err){
        return null;
    }
}

// user info by documentid
async function getUserInfo(documentId,collection){
    try {
        const ref=db.collection(collection).doc(documentId);
         const data=await ref.get();
         if (!data.exists) {
            return null
          } else {
            return data.data();
          }
    } catch (error) {
        return null;
    }
}

// profile by email id
// for webapp
async function getUserProfile(email,collection){
    try {
        var data=[];
        const ref=db.collection(collection);
        const snapshot=await ref.where("email",'==',email).get();
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    } catch (error) {
        return null;
    }
}

async function getStatsAndIncreement(role){
    var numbers=[];
    const ref=db.collection('stats');
    var value;
    let snapshot=await ref.get();
    snapshot.docs.forEach((item)=>{
        numbers.push({
            'noofpatients':item.data()['noofpatients'],
            'noofdoctors':item.data()['noofdoctors'],
            'documentid':item.id
        });
    });
    if(role == 'patient'){
        value=parseInt(numbers[0]['noofpatients'])+1;
        await db.collection('stats').doc(numbers[0]['documentid']).update({'noofpatients':value.toString()});
        return 'P'+value.toString();
    }else if(role == 'doctor'){
        value=parseInt(numbers[0]['noofdoctors'])+1;
        await db.collection('stats').doc(numbers[0]['documentid']).update({'noofdoctors':value.toString()});
        return 'D'+value.toString();
    }   
}

async function addUser(collection,data){
    try {
       await db.collection(collection).doc().set(data);
    const user={
        email:data['email'],
        userid:data['userid'],
    };

    if(collection == 'Patient'){
        user.role='patient';
            await db.collection('users').doc().set(user);
    }else if(collection == 'Doctor'){
        user.role='doctor';
        await db.collection('users').doc().set(user);
    }
        return 1;
    } catch (error) {
        return null;
    }
}

async function updateUserData(documentId,data,collection){
    try {
        await db.collection(collection).doc(documentId).update(data);
        return 1;
    } catch (error) {
        return 0;
    }
}

async function createNewUser(email,password){
    // 1) send email from app to node.js
    // 2) check here if email is valid ,if it is valid then create user , generate password, send email to user containing password.
    // 3) send a response back to app that user is created and then it can send request to add user info to firestore.
    // 4) if user already exists or any other error send response containing appropriate text to the app.
  var result=await  getAuth().createUser({
        email:email,
        password:password,
        disabled:false,
        emailVerified: false,
    }).then((userRecord)=>{
        return {code:'auth/created-new-user',message:'User created'};
    }).catch((error)=>{
        return error.errorInfo;
    })
    return result;
}

async function getRole(email){
    try{
        var data=[];
        var ref= db.collection('users');
        const snapshot=await ref.where('email','==',email).get();
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    }catch(err){
        return null;
    }
}

function checkDeviceType(request){
    let index;
     request.rawHeaders.map((item,i)=>{
         if(item=='User-Agent'){
             index=i;
            }
        });
    let device=request.rawHeaders[index+1].toString();  
    return device.search('Dart') !== -1;
}

 function authMiddleware(request,response,next){
    // Only for flutter app
    let isMobile=checkDeviceType(request);
    console.log(`Mobile ${isMobile}`);
    var token;
    var type=0;
     if(isMobile){
        let temp=request.headers.authorization;
        token=temp.split(" ")[1];
        type=1;
    }else{
        const email=request.params.email;
         token=request.cookies[email];
    }
    if (!token) {
        if(type){
            response.status(401).send({ message: "No token provided" });
        }else{
            response.redirect(302,'/login');
        }
    }
    getAuth().verifyIdToken(token).then((decodedToken)=>{
        const decodedtoken=decodedToken.uid;
        next();
    }).catch((error)=>{
        if(type){
            response.status(403).send({message:error.errorInfo.code});
        }else{
            response.redirect(302,'/login');
        }
    });
}


module.exports={checkDeviceType,authMiddleware,getDocsId,getUserInfo,getUserProfile,updateUserData,addUser,createNewUser,getStatsAndIncreement,getRole};