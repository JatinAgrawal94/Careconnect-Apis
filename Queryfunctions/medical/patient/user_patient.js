const {db}=require('../../db.js');

// add documentid to the all patient data.
async function getPatientData(){
    try {
        var data=[];
        const docRef=await db.collection('Patient');
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
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
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
        })
        return data;
    } catch (error) {
        return null;
    }
}

async function deleteAnyPatientRecord(patientdocumentId,recordId,category){
    try {
        let ref=db.collection(`Patient/${patientdocumentId}/${category}`);
        await ref.doc(recordId).delete();
        return 1;
    } catch (error) {
        // console.log(error);
        return 0;
    }
}

async function updateApproval(documentId,recordId,category,value){
    try {
        let ref=db.collection(`Patient/${documentId}/${category}`);
        await ref.doc(recordId).update({approved:!value});
        return 1;
    } catch (error) {
        // console.log(error);
        return 0;
    }
}

module.exports={getPatientData,getCategoryData,deleteAnyPatientRecord,updateApproval};