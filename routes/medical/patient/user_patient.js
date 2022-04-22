const express=require('express');
const patientRouter=express();
const {getDocsId,getUserInfo, updateUserData, addUser, createNewUser, getStatsAndIncreement, authMiddleware}=require("../../../Queryfunctions/medical/general");
const {getPatientData, getCategoryData, deleteAnyPatientRecord, updateApproval, getSubCollections}=require('../../../Queryfunctions/medical/patient/user_patient');
const {db}=require('../../../Queryfunctions/db');
const {bookTest, getBookedTests, cancelBookedTest}=require('../../../Queryfunctions/medical/booking');
// mobile apis
// get list of all patients
patientRouter.get("/allpatient",authMiddleware,async(req,res)=>{
  const data=await getPatientData();
  if(data){
      res.send(data);
  }else{
      res.status(404).send({status:'0'});
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
patientRouter.get('/getdocsid',authMiddleware,async(req,res)=>{
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
    // await updatePatientData(documentid,data);
    res.send({status:'1'});
  } catch (error) {
    res.status(404).send({status:'0'});
  }
});

patientRouter.put('/approval',authMiddleware,async(req,res)=>{
  let result=await updateApproval(req.body.documentid,req.body.recordid,req.body.category,req.body.value);
  res.send({status:result});
});


patientRouter.post('/createuser',authMiddleware,async(req,res)=>{
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

  patientRouter.get("/categorystats",async(req,res)=>{
    let documentid=req.query.documentid;
    let collections=await getSubCollections(documentid);
    console.log(collections);
    res.send(collections);
  });

  // get stats 
  // only for patients.
  patientRouter.get('/getstats',authMiddleware,async(req,res)=>{
    try {
      var data=await getStatsAndIncreement('patient');
      res.send({userid:data});
    } catch (error) {
      res.send({message:"error"});
    }
  });

  patientRouter.get('/booktest/all',async(req,res)=>{
    let patientemail=req.query.email;
    if(patientemail==null || patientemail==""){
      res.send({'message':'invalid email'});
    }
    let data=await getBookedTests(patientemail);
    res.send(data);
  })

  patientRouter.post('/booktest/delete',authMiddleware,async(req,res)=>{
    let body=req.body;
    if(body.documentid==null){
      res.send({message:'Provide all data fields'});
    }else{
      let result=await cancelBookedTest(body.documentid);
      res.send({status:result});
    }
  });
  
  patientRouter.post('/booktest/:testtype/create',authMiddleware,async(req,res)=>{
    let testtype=req.params.testtype;
    let body=req.body;
    if( body.time==null ||body.testname==null || body.date==null || body.patientname==null || body.patientemail==null || testtype==null){
      res.send({message:'Provide all data fields'});
    }else{
      body.delete=0;
      let result=await bookTest(body.testname,body.date,body.patientname,body.patientemail,testtype,body.time);
      res.send({status:result});
    }
  });

  // add patient record data.
  patientRouter.post('/:category/create',authMiddleware,async(req,res)=>{
    try {
      const category=req.params.category;
      const patientId=req.body.patientId;
      const data=JSON.parse(req.body.data);
      data.delete=0;
      const ref=await db.collection(`Patient/${patientId}/${category}`).doc().set(data);
      res.send({'status':"1"});
    } catch (error) {
      console.log(error);
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