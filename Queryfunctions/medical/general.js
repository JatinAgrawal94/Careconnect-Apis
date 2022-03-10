const {db}=require('../db');

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

// async function addUser(collection){
//     try {
//         const ref=db.collection(collection).add()
//     } catch (error) {
        
//     }
// }

async function updateUserData(documentId,data,collection){
    try {
        const ref=await db.collection(collection).doc(documentId).update(data);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

module.exports={getDocsId,getUserInfo,updateUserData};