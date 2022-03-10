const {db}=require('../../db.js');

// add documentid to the all patient data.
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

module.exports={getPatientData,getCategoryData};