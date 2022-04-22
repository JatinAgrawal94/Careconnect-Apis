const express=require('express');
const { auth } = require('google-auth-library');
const appointmentRouter= express();
const {getDoctorAppointments,getPatientAppointments,getAppointmentDates, getPatientsBasedOnDateAndDoctor, createAppointment, checkUserValidity, updatepaymentamount, deleteAppointment, updatepaymentstatus}=require('../../Queryfunctions/medical/appointment');
const { authMiddleware } = require('../../Queryfunctions/medical/general');

// get all doctor appointments
appointmentRouter.get('/doctor',authMiddleware,async(req,res)=>{ 
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
appointmentRouter.get('/patient',authMiddleware,async(req,res)=>{
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

appointmentRouter.post('/create',authMiddleware,async(req,res)=>{
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

appointmentRouter.get('/appointmentdates',authMiddleware,async(req,res)=>{
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

appointmentRouter.post('/check',authMiddleware,async(req,res)=>{
    try {
        let data=req.body;
        var status=await checkUserValidity(data['doctoremail'],data['patientemail'],data['date']);
        let result={
            'status':status
        }
        if(status === 1){
            res.send(result);
        }else if(status == 0){
            res.send(result);
        }else{
            throw Error;
        }
    } catch (error) {
        res.send("Error");
    }
})

// appointments based on date and doctor.
appointmentRouter.get('/specific',authMiddleware,async(req,res)=>{
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

appointmentRouter.post('/updatepaymentamount',authMiddleware,async(req,res)=>{
    try{
        const doctoremail=req.body.doctoremail;
        const patientemail=req.body.patientemail;
        const paymentamount=req.body.paymentamount;
        const paymentstatus=req.body.paymentstatus;
        const date=req.body.date;
        await updatepaymentamount(doctoremail,patientemail,date,paymentamount,paymentstatus);
        res.send({'status':'1'});
    }catch(error){
        res.send({'status':'0'});
    }
});

appointmentRouter.post('/updatepaymentstatus',authMiddleware,async(req,res)=>{
    try {
        const doctoremail=req.body.doctoremail;
        const patientemail=req.body.patientemail;
        const paymentamount=req.body.paymentamount;
        const date=req.body.date;
        let result=await updatepaymentstatus(doctoremail,patientemail,date,paymentamount);
        res.send({'status':result});
         
    } catch (error) {
        res.send({'status':'0'});
    }
});
// delete appointments
appointmentRouter.post('/delete',authMiddleware,async(req,res)=>{
    try {
        const documentid=req.body.documentid;
        let result=await deleteAppointment(documentid);
        if(result){
            res.send("Success");
        }else{
            throw Error;
        }
    } catch (error) {
        res.send("Failed");
    }
});

// take all appointment data giving doctoremail as input.
// store dates in a set in order to get unique dates
// use set datastructure to store unique values of the appointment dates

module.exports=appointmentRouter;