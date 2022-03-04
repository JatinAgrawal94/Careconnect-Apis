const express=require('express');
const patientRouter=express();
const {getPatientData}=require('../../../Queryfunctions/medical/patient/user_patient');
const preRouter=require('./prescriptionRouter');

patientRouter.get("/allpatient",async(req,res)=>{
  const data=await getPatientData();
  if(data){
      res.send(data);
  }else{
      res.status(404).send("Error getting data");
  }
});

// about,allergy,blood-glucose,examination,family-history,labtest,medical-visit,notes,pathology,prescription
// radiology, surgery, vaccine, book appointment
patientRouter.use('/prescription',preRouter);

module.exports=patientRouter;