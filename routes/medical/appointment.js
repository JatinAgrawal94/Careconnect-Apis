const express=require('express');
const appointmentRouter= express();
const {getDoctorAppointments,getPatientAppointments,getAppointmentDates, getPatientsBasedOnDateAndDoctor, createAppointment, checkUserValidity, updatepaymentamount}=require('../../Queryfunctions/medical/appointment');

// get all doctor appointments
appointmentRouter.get('/doctor',async(req,res)=>{ 
    try {
        const email=req.query.email;
        const data=await getDoctorAppointments(email);
        if(data){
            res.send(data);
        }else{
            throw Error;
        }
    } catch (error) {
        res.status(404).send("Error in getting data");
    }
});

// get all patient appointments
appointmentRouter.get('/patient',async(req,res)=>{
    try {
        const email=req.query.email;
        const data=await getPatientAppointments(email);
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
});

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

appointmentRouter.post('/check',async(req,res)=>{
    try {
        let data=req.body;
        var status=await checkUserValidity(data['doctoremail'],data['patientemail'],data['date']);
        if(status === 1){
            res.send(status.toString());
        }else if(status == 0){
            res.send(status.toString());
        }else{
            throw Error;
        }
    } catch (error) {
        res.send("Error");
    }
})

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

appointmentRouter.post('/updatepaymentamount',async(req,res)=>{
    try{
        const doctoremail=req.body.doctoremail;
        const patientemail=req.body.patientemail;
        const paymentamount=req.body.paymentamount;
        const paymentstatus=req.body.paymentstatus;
        const date=req.body.date;
        await updatepaymentamount(doctoremail,patientemail,date,paymentamount,paymentstatus);
        res.send("Success");
    }catch(error){
        res.send("Failed");
    }
})

// take all appointment data giving doctoremail as input.
// store dates in a set in order to get unique dates
// use set datastructure to store unique values of the appointment dates

module.exports=appointmentRouter;