const {db}=require('../../db.js');
const {storage,ref,deleteObject}=require('../../dbl');
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

// here we need patient user id also for the same to delete the media of the data.
async function deleteAnyPatientRecord(patientdocumentId,recordId,category,mediaInfo=null){
    try {
        // create mediaInfo as an optional parameter.
        if(mediaInfo!==null){
            await deleteMedia(mediaInfo['media'],category,mediaInfo['userid']);
        }
        let ref=db.collection(`Patient/${patientdocumentId}/${category}`);
        await ref.doc(recordId).delete();
        return 1;
    } catch (error) {
        console.log("Error in delete function");
        console.log(error);
        return 0;
    }
}

async function updateApproval(documentId,recordId,category,value){
    try {
        var newValue;
        if(value=='false'){
            newValue='true';
        }else{
            newValue='false';
        }
        let ref=db.collection(`Patient/${documentId}/${category}`);
        await ref.doc(recordId).update({approved:newValue});
        return 1;
    } catch (error) {
        // console.log(error);
        return 0;
    }
}

async function deleteMedia(media,category,patientUserId){
    try {
        console.log(patientUserId);
        console.log(category);
        const images=media['images'];
        const videos=media['videos'];
        const files=media['files'];
        if(images.length!==0){
            for(let i=0;i<images.length;i++){
                let mediaref=ref(storage,`Patient/${patientUserId}/${category}/images/${images[i]['name']}`);
                await deleteObject(mediaref);
            }
        }
        if(videos.length!==0){
            for(let i=0;i<videos.length;i++){
                let mediaref=ref(storage,`Patient/${patientUserId}/${category}/videos/${videos[i]['name']}`);
                await deleteObject(mediaref);
            }
        }
        if(files.length!==0){
            for(let i=0;i<files.length;i++){
                let mediaref=ref(storage,`Patient/${patientUserId}/${category}/files/${files[i]['name']}`);
                await deleteObject(mediaref);
            }
        }
        return 1;
    } catch (error) {
        return 0;
    }
}


module.exports={getPatientData,getCategoryData,deleteAnyPatientRecord,updateApproval};