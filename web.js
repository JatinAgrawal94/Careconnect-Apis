const express=require('express');
const webRouter=express();
const {getPatientData}=require('./db.js');

webRouter.get("/patientdata",async (req,res)=>{
    await getPatientData();
    res.send();
})

webRouter.get("/doctordata",(req,res)=>{
    
});

webRouter.get('/appointment',(req,res)=>{
    res.send();
})
module.exports=webRouter;