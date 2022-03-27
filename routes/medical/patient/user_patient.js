const express=require('express');
const patientRouter=express();
const {getDocsId,getUserInfo, updateUserData, addUser, createNewUser, getStatsAndIncreement, authMiddleware}=require("../../../Queryfunctions/medical/general");
const {getPatientData, getCategoryData, deleteAnyPatientRecord, updateApproval}=require('../../../Queryfunctions/medical/patient/user_patient');
const {db}=require('../../../Queryfunctions/db');

// mobile apis
// get list of all patients
patientRouter.get("/allpatient",authMiddleware,async(req,res)=>{
  const data=await getPatientData();
  if(data){
      res.send(data);
  }else{
      res.status(404).send("Error getting data");
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
    res.status(404).send("Error");
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
    res.status(404).send("Error");
  }
})


patientRouter.post('/add',authMiddleware,async(req,res)=>{
  try {
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await addUser(collection,data);
    res.send("Success");
  } catch (error) {
    res.status(404).send("Error");
  }
});

// route to update patient data
patientRouter.post('/update',authMiddleware,async(req,res)=>{
  try {
    let documentid=req.body.documentid;
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await updateUserData(documentid,data,collection);
    // await updatePatientData(documentid,data);
    res.send("Sucess");
  } catch (error) {
    res.status(404).send("Error");
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
      let response=await deleteAnyPatientRecord(patientdocumentId,recordId,category);
      if(response){
        res.send('Success');
      }else{
        throw Error;
      }
    } catch (error) {
      res.send('Error');
    }
  })

  // add patient record data.
  patientRouter.post('/:category/create',authMiddleware,async(req,res)=>{
    try {
      const category=req.params.category;
      const patientId=req.body.patientId;
      const data=JSON.parse(req.body.data);
      data.delete=0;
      const ref=await db.collection(`Patient/${patientId}/${category}`).doc().set(data);
      res.send("Sucess");
    } catch (error) {
      console.log(error);
      res.send("Fail");
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