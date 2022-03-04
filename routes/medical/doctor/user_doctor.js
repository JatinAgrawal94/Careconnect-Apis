const express=require('express');
const doctorRouter=express();
const {getDoctorData}=require('../../../Queryfunctions/medical/doctor/user_doctor');

doctorRouter.get('/alldoctor',async(req,res)=>{
    const data=await getDoctorData();
    if(data){
        res.send(data);
    }else{
        res.status(404).send("Error in getting data");
    }
});

module.exports=doctorRouter;