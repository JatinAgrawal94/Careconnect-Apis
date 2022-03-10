const {db}=require('../../db.js');

async function getPatientData(){
    try {
        var data=[];
        const docRef=await db.collection('Patient');
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

// async function getUserId(email,collection){
//     try{
//         var data=[];
//         const docRef=db.collection(collection);
//         const snapshot=await docRef.where('email','==',email).get();
//         snapshot.docs.forEach((item)=>{
//             data.push({
//                 'email':item.data()['email'],
//                 'phoneno':item.data()['phoneno'],
//                 'userid':item.data()['userid'],
//                 'documentid':item.id
//         });
//         })
//         return data;
//     }catch(err){
//         console.log(err);
//         return null;
//     }
// }

// async function getPatientInfo(documentId){
//     try {
//         const ref=db.collection('Patient').doc(documentId);
//          const data=await ref.get();
//          if (!data.exists) {
//             return null
//           } else {
//             return data.data();
//           }
//     } catch (error) {
//         return null;
//     }
// }

async function getCategoryData(category,documentId){
    try {
        var data=[];
        const ref=db.collection(`Patient/${documentId}/${category}`);
        const snapshot=await ref.get();
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        })
        
        return data;
    } catch (error) {
        return null;
    }
}

async function updatePatientData(documentId,data){
    try {
        const ref=await db.collection('Patient').doc(documentId).update(data);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

module.exports={getPatientData,getCategoryData,updatePatientData};