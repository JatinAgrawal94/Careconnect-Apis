const express=require('express');
const patientRouter=express();
const {getPatientData}=require('../../../Queryfunctions/medical/patient/user_patient');
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

// add patient record data.
patientRouter.post('/:category/create',async(req,res)=>{
  try {
    const category=req.params.category;
    const patientId=req.body.patientId;
    const data=JSON.parse(req.body.data);
    data.delete='0';
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