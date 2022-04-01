const { getDownloadURL } = require('firebase/storage');
const {db}=require('../../db.js');
const {storage,ref,deleteObject,uploadBytes}=require('../../dbl');

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
        // if(mediaInfo!==null){
        //     await deleteMedia(mediaInfo['media'],category,mediaInfo['userid']);
        // }
        let ref=db.collection(`Patient/${patientdocumentId}/${category}`);
        await ref.doc(recordId).delete();
        return 1;
    } catch (error) {
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

// function to upload record media and receive its url.
async function uploadMediaAndDownLoadURL(media,userId,category){
    try {
        let images=media.data.images;
        let videos=media.data.videos;
        let files=media.data.files;
        console.log(`images are ${images}`);
        for(let i=0;i<images.length;i++){
            let storageRef=ref(storage,`Patient/${userId}/${category}/images/${images[i]['name']}`);
            await uploadBytes(storageRef,images[i]['filename']);
        }
        for(let i=0;i<videos.length;i++){
            let storageRef=ref(storage,`Patient/${userId}/${category}/videos/${videos[i]['name']}`);
            await uploadBytes(storageRef,videos[i]['filename']);
        }
        for(let i=0;i<files.length;i++){
            let storageRef=ref(storage,`Patient/${userId}/${category}/files/${files[i]['name']}`);
            await uploadBytes(storageRef,files[i]['filename']);
        }
        var data=await getMediaURL(media,category,userId);
        return data;
    } catch (error) {
        console.log("Error in upload function");
        console.log(error);
        return 0;
    }
}

// sub function to get mediaURL of uploaded data.
async function getMediaURL(media,category,userId){
    try {
        const images=media.images;
        const videos=media.videos;
        const files=media.files;
        var data={
            'images':[],
            'videos':[],
            'files':[]
        };

        for(let i=0;i<images.length;i++){
            let storageRef=ref(storage,`Patient/${userId}/${category}/images/${images[i]['name']}`);
            let url=await getDownloadURL(storageRef);
            data.images.push(url);
        }
        for(let i=0;i<videos.length;i++){
            let storageRef=ref(storage,`Patient/${userId}/${category}/videos/${videos[i]['name']}`);
            let url=await getDownloadURL(storageRef);
            data.videos.push(url);
        }
        for(let i=0;i<files.length;i++){
            let storageRef=ref(storage,`Patient/${userId}/${category}/files/${files[i]['name']}`);
            let url=await getDownloadURL(storageRef);
            data.files.push(url);
        }
        return data;
    } catch (error) {
        console.log("Error in download function");
        console.log(erorr);
        return 0;         
    }
}

async function deleteMedia(media,category,patientUserId){
    try {
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

async function uploadProfileImage(media,userId){
    // object media={file:File()}
    try {
        let storageRef=ref(storage,`profile_images/${userId}`);
        await uploadBytes(storageRef,media.file);
        var url=await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        return 0;
    }
}

module.exports={uploadMediaAndDownLoadURL,getPatientData,getCategoryData,deleteAnyPatientRecord,updateApproval};