const express=require('express');
const patientRouter=express();
const {getDocsId,getUserInfo, updateUserData, addUser, createNewUser, getStatsAndIncreement, authMiddleware}=require("../../../Queryfunctions/medical/general");
const {getPatientData, getCategoryData, deleteAnyPatientRecord, updateApproval, getSubCollections, sendDirectionsToAmbulance,uploadMedia, createRecord}=require('../../../Queryfunctions/medical/patient/user_patient');
const {db}=require('../../../Queryfunctions/db');
const {bookTest, getBookedTests, cancelBookedTest, getAllBookedTests, changePatientPresence}=require('../../../Queryfunctions/medical/booking');

// mobile apis

// get list of all patients
patientRouter.get("/allpatient",authMiddleware,async(req,res)=>{
  try {  
    const data=await getPatientData();
    if(data){
      res.send(data);
    }else{
      res.status(404).send({status:'0'});
    }
  } catch (error) {
    res.send({'message':'error'});
  }
});

// get all document data of a specific patient
patientRouter.get('/info',authMiddleware,async(req,res)=>{
  const documentid=req.query.documentid;
  const collection=req.query.collection;
  try {
    const data=await getUserInfo(documentid,collection);
    if(data){
      res.send(data);
    }else{
      throw error;
    }
  } catch (error) {
    res.status(404).send({status:'0'});
  }
})

// get patient document id
patientRouter.get('/getdocsid',async(req,res)=>{
  try {
    const email=req.query.email;
    const role=req.query.role;
    const data=await getDocsId(email,role);
    if(data){
      res.send(data);
    }else{
      throw error;
    }
  } catch (error) {
    res.status(404).send({status:'0'});
  }
})


patientRouter.post('/add',authMiddleware,async(req,res)=>{
  // add feature to upload profile image of user to storage and save its link in database.
  try{
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await addUser(collection,data);
    res.send({status:'1'});
  } catch (error) {
    res.status(404).send({status:'0'});
  }
});

// route to update patient data
patientRouter.post('/update',authMiddleware,async(req,res)=>{
  // add feature to update profile photo of the user.
  try{
    let documentid=req.body.documentid;
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await updateUserData(documentid,data,collection);
    res.send({status:'1'});
  } catch (error) {
    res.status(404).send({status:'0'});
  }
});

patientRouter.put('/approval',authMiddleware,async(req,res)=>{
  try {  
    let result=await updateApproval(req.body.documentid,req.body.recordid,req.body.category,req.body.value);
    res.send({status:result});
  } catch (error) {
    res.send({'message':'error'});
  }
});


patientRouter.post('/createuser',authMiddleware,async(req,res)=>{
    try { 
      let email=req.body.email;
      let password=req.body.password;
      let bool=await createNewUser(email,password);
      if(bool.message == "User created"){
        var userid=await getStatsAndIncreement('patient');
        bool['userid']=userid;
        res.send(bool);
      }else{
        res.send(bool);
      }
    } catch (error) {
      res.send({'message':'Error'});
    }
  });
  
  // delete any patient record
  patientRouter.post('/record/delete',authMiddleware,async(req,res)=>{
    try {
      const patientdocumentId=req.body.patientid;
      const recordId=req.body.recordid;
      const category=req.body.category;
      const userid=req.body.userid;
      const media=JSON.parse(req.body.media);
      let response = await deleteAnyPatientRecord(patientdocumentId,recordId,category,media,userid);
      if(response){
        res.send({status:'1'});
      }else{
        throw Error;
      }
    } catch (error) {
      res.send({status:'0'});
    }
  })

  patientRouter.get("/categorystats",authMiddleware,async(req,res)=>{ 
    try {
      let documentid=req.query.documentid;  
      let collections=await getSubCollections(documentid);
      res.send(collections);
    } catch (error) {
      res.send({'message':'error'});
    }   
  });

  // get stats 
  // only for patients.
  patientRouter.get('/getstats',async(req,res)=>{
    try {
      var data=await getStatsAndIncreement('patient');
      res.send({userid:data});
    } catch (error) {
      res.send({message:"error"});
    }
  });

  
  patientRouter.get('/booktest/alldata',async(req,res)=>{
    try { 
        let data=await getAllBookedTests();
        res.send(data);
    } catch (error) {
      res.send({'message':'error'});
    }
  })

  patientRouter.post('/booktest/status',authMiddleware,async(req,res)=>{
    try { 
      if(req.body.presence==null ||req.body.presence=="" ||req.body.documentid==null ||req.body.documentid=="" ){
        res.send({'message':'Invalid Query Parameter'});
      }else{
        let data=await changePatientPresence(req.body.documentid,req.body.presence); 
        res.send(data);
      }
    } catch (error) {
      res.send({'message':'error'});
    }
  })

  patientRouter.get('/booktest/all',authMiddleware,async(req,res)=>{
    try { 
      if(req.query.email==null || req.query.email=="" || req.query.email==undefined){
        res.send({'message':'invalid email'});
      }else{
        let patientemail=req.query.email;
        let data=await getBookedTests(patientemail);
        res.send(data);
      }
    } catch (error) {
      res.send({'message':'error'});
    }
  })

  patientRouter.post('/booktest/delete',authMiddleware,async(req,res)=>{
    try {
      let body=req.body;
      if(req.body==null){
        res.send({'message':'body is absent'});
      }
      if(body.documentid==null){
        res.send({message:'Provide all data fields'});
      }else{
        let result=await cancelBookedTest(body.documentid);
        res.send({status:result});
      }
    } catch (error) {
       res.send({'messsage':'error'});
    }
  });
  
  patientRouter.post('/booktest/:testtype/create',authMiddleware,async(req,res)=>{
    try {  
      let testtype=req.params.testtype;
      let body=req.body;
      if(body.presence==null || body.time==null ||body.testname==null || body.date==null || body.patientname==null || body.patientemail==null || testtype==null){
        res.send({message:'Provide all data fields'});
      }else{
        body.delete=0;
        let result=await bookTest(testtype,body);
        res.send({status:result});
      }
    } catch (error) {
      res.send({'message':'error'});
    }
  });

  // add patient record data.
  patientRouter.post('/:category/create',authMiddleware,async(req,res)=>{
    try {
      const category=req.params.category;
      const patientId=req.body.patientId;
      const data=req.body;
      const files=req.files;
      delete data.patientId;
      const info=await getUserInfo(patientId,'Patient');
      let keys=Object.keys(req.files);
      var media={
        images:[],
        videos:[],
        files:[]
      }
      for(let i=0;i<keys.length;i++){
        let url=await  uploadMedia(info['userid'],'Patient',files[keys[i]],category);
        let temp=files[keys[i]]['mimetype'].split('/')[0];
        let type=temp == 'application'?'file':temp=='image'?'image':'video';
        if(type=='file'){
          media['files'].push(url);
        }else if(type=='image'){
          media['images'].push(url);
        }else{
          media['videos'].push(url);
        }
      }
      data.delete=0;
      data.media=media;
      let result=await createRecord(patientId,category,data);
      res.send({'status':"1"});
    } catch (error) {
      res.send({'status':'0'});
    }
  });
  
  // route to get all documents of a patient's particular medical field eg:allergy,medicalvisits etc.
  patientRouter.get('/:category/all',authMiddleware,async(req,res)=>{
    try{
      let category=req.params.category;
      let documentid=req.query.documentid;
      let data=await getCategoryData(category,documentid);
      if(data){
        res.send(data);
      }else{
        throw error;
      }
    }catch(error){
      res.status(404).send("Error");
    }
  });

module.exports=patientRouter;