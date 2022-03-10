const express=require('express');
const patientRouter=express();
const {getDocsId,getUserInfo}=require("../../../Queryfunctions/medical/general");
const {getPatientData,getPatientInfo, getCategoryData,updatePatientData}=require('../../../Queryfunctions/medical/patient/user_patient');
const preRouter=require('./prescriptionRouter');
const {db}=require('../../../Queryfunctions/db');

// get list of all patients
patientRouter.get("/allpatient",async(req,res)=>{
  const data=await getPatientData();
  if(data){
      res.send(data);
  }else{
      res.status(404).send("Error getting data");
  }
});

// get all document data of a specific patient
patientRouter.get('/info',async(req,res)=>{
  const documentid=req.query.documentid;
  const role=req.query.role;
  try {
    const data=await getUserInfo(documentid,role);
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
    res.status(404).send("Error");
  }
})

// add patient record data.
patientRouter.post('/:category/create',async(req,res)=>{
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
patientRouter.get('/:category/all',async(req,res)=>{
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
})

// route to update patient data
patientRouter.post('/update',async(req,res)=>{
  try {
    let documentid=req.body.documentid;
    let data=JSON.parse(req.body.data);
    await updatePatientData(documentid,data);
    res.send("Sucess");
  } catch (error) {
    res.status(404).send("Error");
  }
});

// addappointment,

module.exports=patientRouter;