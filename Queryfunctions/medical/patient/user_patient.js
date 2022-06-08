const { getDownloadURL } = require('firebase/storage');
const {db}=require('../../db.js');
const {storage,ref,deleteObject,uploadBytes}=require('../../dbl');
const {google} = require('googleapis');
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
        });
        if(category.toLowerCase()=='pathology'){
            var list=await getPathologyList();
            return {'data':data,'fields':list};
        }
        if(category.toLowerCase()=='radiology'){
            var list=await getRadiologyList();
            return {'data':data,'fields':list};
        }
        return data;
    } catch (error) {
        return null;
    }
}

async function getSubCollections(documentId){
    try {
        let data=[];
        var originaldata= [
            "About",
            "Allergy",
            "Blood Glucose",
            "Blood Pressure",
            "Examination",
            "Family History",
            "Medical Visit",
            "Notes",
            "Pathology",
            "Prescription",
            "Radiology",
            "Surgery",
            "Vaccine"
          ];
        var result=[];
        let ref=await db.collection("Patient").doc(documentId);    
        let collections=await ref.listCollections();
        if(collections.length==0){
            return data;
        }
        collections.forEach((element)=>{
            data.push(element._queryOptions.collectionId);
        });
        originaldata.forEach((element,index)=>{
            var r=data.find(e=>e===element.replace(/\s/g, '').toLowerCase());
            if(r){
                result.push({
                    field:element,
                    index:index
                });
            }
          });
        return result;
    } catch (error) {
        return 0;
    }
}

// here we need patient user id also for the same to delete the media of the data.
async function deleteAnyPatientRecord(patientdocumentId,recordId,category,media,userid){
    try {
        let ref=db.collection(`Patient/${patientdocumentId}/${category}`);
        await ref.doc(recordId).delete();
        if(userid!=null && userid!="null"){
            await deleteMedia(media,category,userid);
        }
        return 1;
    } catch (error) {
        return 0;
    }
}

async function createRecord(patientId,category,data){
    try {
        const ref=await db.collection(`Patient/${patientId}/${category}`).doc().set(data);
        return {'status':'1'};
    } catch (error) {
        return {'status':'0'};
    }
}

async function getPathologyList(){
    try {
        var data=[];
        const sheets=google.sheets({
            version:'v4',
            auth:process.env.SHEETS_API_KEY  
            });
        const res=await sheets.spreadsheets.get({
            ranges:["Pathology_Test_Names!C2:C52"],
            includeGridData:true,
            spreadsheetId:"1v0MuJjL4JC6HgPRvTouZbQ76Tb_yef4lBIncSB1QA7E"
        });
        var response=res.data.sheets;
        response[0].data[0].rowData.forEach((element)=>{
            data.push(element.values[0].formattedValue);
        });
        return data;
    } catch (error) {
        return [];
    }
}

async function getRadiologyList(){
    try {
        var data=[];
        const sheets=google.sheets({
            version:'v4',
            auth:process.env.SHEETS_API_KEY  
            });
        const res=await sheets.spreadsheets.get({
            ranges:["Radiology_Test_Names!A2:A12"],
            includeGridData:true,
            spreadsheetId:"1v0MuJjL4JC6HgPRvTouZbQ76Tb_yef4lBIncSB1QA7E"
        });
        var response=res.data.sheets;
        response[0].data[0].rowData.forEach((element)=>{
            data.push(element.values[0].formattedValue);
        });
        return data; 
    } catch (error) {
        return [];
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
        return 0;
    }
}

async function sendDirectionsToAmbulance(data,contact){
    const accountSid = 'ACba492605fa68a3db400bf0613b3141d7'; 
    const authToken = '[Redacted]'; 
    const client = require('twilio')(accountSid, authToken); 
    client.messages 
        .create({ 
            body: 'Your appointment is coming up on July 21 at 3PM', 
            from: 'whatsapp:+14155238886',       
            to: `whatsapp:+91${contact}` 
        }) 
        .then(message => console.log(message.sid)) 
        .done();
}

async function uploadMedia(userid,collection,media,category){
    try {
        let temp=media['mimetype'].split('/')[0];
        let type;
        type=temp == 'application'?'files':temp=='image'?'images':'videos';
        const storageRef=ref(storage,`${collection}/${userid}/${category}/${type}/${media['name']}`);
        await  uploadBytes(storageRef,media.data).then((snapshot)=>{        });
        let url=await getDownloadURL(storageRef);
        return {
            'name':media.name.toString(),
            'url':url.toString()
        };
    } catch (error) {
        return null;
    }
}



module.exports={createRecord,uploadMedia,sendDirectionsToAmbulance,getSubCollections,getPatientData,getCategoryData,deleteAnyPatientRecord,updateApproval};

