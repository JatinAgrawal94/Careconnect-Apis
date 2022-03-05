const express=require('express');
const appointmentRouter= express();
const {getAppointments}=require('../../Queryfunctions/medical/appointment');

appointmentRouter.get('/allappointment',async(req,res)=>{
    const data=await getAppointments();
    if(data){
        res.send(data);
    }else{
        res.status(404).send("Error in getting data");
    }
});

module.exports=appointmentRouter;