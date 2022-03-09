const express=require('express');
const patientRouter=express();
const {getPatientData,getUserId,getPatientInfo}=require('../../../Queryfunctions/medical/patient/user_patient');
const preRouter=require('./prescriptionRouter');
const {db}=require('../../../Queryfunctions/db');

patientRouter.get("/allpatient",async(req,res)=>{
  const data=await getPatientData();
  if(data){
      res.send(data);
  }else{
      res.status(404).send("Error getting data");
  }
});

patientRouter.get('/info',async(req,res)=>{
  const documentid=req.query.documentid;
  try {
    const data=await getPatientInfo(documentid);
    if(data){
      res.send(data);
    }else{
      throw error;
    }
  } catch (error) {
    res.status(404).send("Error");
  }
})

patientRouter.get('/getdocsid',async(req,res)=>{
  try {
    const email=req.query.email;
    const data=await getUserId(email,'Patient');
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


// about,allergy,blood-glucose,examination,family-history,labtest,medical-visit,notes,pathology,prescription
// radiology, surgery, vaccine, book appointment

module.exports=patientRouter;