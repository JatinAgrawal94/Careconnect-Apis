const {db,getAuth}=require('../db');

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
        })
        return data;
    }catch(err){
        console.log(err);
        return null;
    }
}

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
        console.log(error);
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
        // console.log('Successfully created new user:', userRecord.uid);
        return {code:'auth/created-new-user',message:'User created'};
    }).catch((error)=>{
        return error.errorInfo;
    })
    return result;
}

module.exports={getDocsId,getUserInfo,updateUserData,addUser,createNewUser,getStatsAndIncreement};