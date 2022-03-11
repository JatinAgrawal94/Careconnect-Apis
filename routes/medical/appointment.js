const express=require('express');
const appointmentRouter= express();
const {getAppointments}=require('../../Queryfunctions/medical/appointment');

appointmentRouter.get('/allappointment',async(req,res)=>{
    try {
        const email=req.query.email;
        const data=await getAppointments(email);
        if(data){
            res.send(data);
        }else{
            throw Error;
        }
    } catch (error) {
        res.status(404).send("Error in getting data");
    }
});
// take all appointment data giving doctoremail as input.
// store dates in a set in order to get unique dates
// use set datastructure to store unique values of the appointment dates

module.exports=appointmentRouter;