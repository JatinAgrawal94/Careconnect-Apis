const express=require('express');
const doctorRouter=express();
const {checkLoginStatus}=require('../../../Queryfunctions/medical/auth');
const {getPatientData}=require('../../../Queryfunctions/medical/patient/user_patient');
const {getDoctorData}=require('../../../Queryfunctions/medical/doctor/user_doctor');
const {getDoctorAppointments}=require('../../../Queryfunctions/medical/appointment');
const {getDocsId,getUserInfo,updateUserData,addUser,createNewUser,getStatsAndIncreement,getUserProfile, authMiddleware}=require("../../../Queryfunctions/medical/general");

doctorRouter.get('/:email',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  // if(result!==null && email==result.email){
    // const cookies=req.cookies[email];
    const patients=await getPatientData();
    const appointments=await getDoctorAppointments(email);
    res.render('doctor/doctor_dashboard',{patient:patients,appointment:appointments,email:email});
  // }else{
  //   res.redirect(302,'/login');
  // }
});

doctorRouter.get('/:email/profile',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  var result=await checkLoginStatus();
  if(result!==null && email==result.email){
    const data=await getUserProfile(email,'Doctor');
    res.render('doctor/doctor_profile',{data:data,isAdmin:undefined});
  }else{
    res.redirect(302,'/login');
  }
});

doctorRouter.get('/:email/patientlist',authMiddleware,async(req,res)=>{
  var result=await checkLoginStatus();
  const email=req.params.email;
  if(result!==null && email==result.email){
    const patients=await getPatientData();
    res.render('doctor/patients_list',{patient:patients,email:email});
  }else{
    res.redirect(302,'/login');
  }
});

doctorRouter.get('/:email/patientlist/:patientemail/profile',authMiddleware,async(req,res)=>{
  var result=await checkLoginStatus();
  const email=req.params.email;
  if(result!==null && email==result.email){
    const patientemail=req.params.patientemail;
    const data=await getUserProfile(patientemail,'Patient');
    res.render('patient/profile_page',{patient:data,isAdmin:undefined});
  }else{
    res.redirect(302,'/login');
  }
});

doctorRouter.get('/:email/appointment',authMiddleware,async(req,res)=>{
  var result=await checkLoginStatus();
  const email=req.params.email;
  if(result!==null && email==result.email){
    const appointments=await getDoctorAppointments(email);
    res.render('appointments/appointment_list',{appointment:appointments,email:email});
  }else{
    res.redirect(302,'/login');
  }
});

// api for mobile app.
doctorRouter.get('/alldoctor',async(req,res)=>{
    const data=await getDoctorData();
    if(data){
        res.send(data);
    }else{
        res.status(404).send("Error in getting data");
    }
});

doctorRouter.get('/getdocsid',async(req,res)=>{
    try {
        const email=req.query.email;
        const role=req.query.role;
        const data=await getDocsId(email,role);
        if(data){
          res.send(data);
        }else{
          throw error;
        }
      } catch (error) {
        res.status(404).send("Error");
      }
});

doctorRouter.get('/info',async(req,res)=>{
    const documentid=req.query.documentid;
    const role=req.query.role;
    try {
      const data=await getUserInfo(documentid,role);
      if(data){
        res.send(data);
      }else{
        throw error;
      }
    } catch (error) {
      res.status(404).send("Error");
    }
});

doctorRouter.post('/update',async(req,res)=>{
  try {
    let documentid=req.body.documentid;
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await updateUserData(documentid,data,collection);
    res.send("Sucess");
  } catch (error) {
    res.status(404).send("Error");
  }
});

doctorRouter.post('/add',async(req,res)=>{
  try {;
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await addUser(collection,data);
    res.send("Sucess");
  } catch (error) {
    res.status(404).send("Error");
  }
});


doctorRouter.post('/createuser',async(req,res)=>{
  let email=req.body.email;
  let password=req.body.password;
  let bool=await createNewUser(email,password);
  if(bool.message == "User created"){
    var userid=await getStatsAndIncreement('doctor');
    bool['userid']=userid;
    res.send(bool);
  }else{
    res.send(bool);
  }
});

module.exports=doctorRouter;