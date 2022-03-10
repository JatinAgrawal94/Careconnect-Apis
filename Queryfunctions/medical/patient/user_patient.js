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