const express=require('express');
const appointmentRouter= express();
const {getAppointments,getAppointmentDates, getPatientsBasedOnDateAndDoctor, createAppointment}=require('../../Queryfunctions/medical/appointment');

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

appointmentRouter.post('/create',async(req,res)=>{
    try {
        const data=req.body;
        let response=await createAppointment(data);
        if(response){
            res.send("Success");
        }else{
            throw Error;
        }
    } catch (error) {
        res.send('Error');
    }
})

appointmentRouter.get('/appointmentdates',async(req,res)=>{
    try {
            const email=req.query.email;
            const data=await getAppointmentDates(email);
            if(data){
                res.send(data);
            }else{
                throw Error;
            }
    } catch (error) {
        res.send("Error")
    }
});

// appointments based on date and doctor.
appointmentRouter.get('/specific',async(req,res)=>{
    try {
        let email=req.query.email;
        let date=req.query.date;
        let data=await getPatientsBasedOnDateAndDoctor(email,date);
        if(data){
            res.send(data);
        }else{
            throw Error;
        }
    } catch (error) {
        res.send("Error");
    }
});

// take all appointment data giving doctoremail as input.
// store dates in a set in order to get unique dates
// use set datastructure to store unique values of the appointment dates

module.exports=appointmentRouter;