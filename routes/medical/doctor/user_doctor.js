const express=require('express');
const doctorRouter=express();
const {getPatientData, getCategoryData}=require('../../../Queryfunctions/medical/patient/user_patient');
const {getDoctorData}=require('../../../Queryfunctions/medical/doctor/user_doctor');
const {getDoctorAppointments, getPatientAppointments}=require('../../../Queryfunctions/medical/appointment');
const {getDocsId,getUserInfo,updateUserData,addUser,createNewUser,getStatsAndIncreement,getUserProfile, authMiddleware}=require("../../../Queryfunctions/medical/general");

// api for mobile app.
doctorRouter.get('/alldoctor',authMiddleware,async(req,res)=>{
    const data=await getDoctorData();
    if(data){
        res.send(data);
    }else{
        res.status(404).send("Error in getting data");
    }
});

doctorRouter.get('/getdocsid',authMiddleware,async(req,res)=>{
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

doctorRouter.get('/info',authMiddleware,async(req,res)=>{
    const documentid=req.query.documentid;
    const collection=req.query.collection;
    try {
      const data=await getUserInfo(documentid,collection);
      if(data){
        res.send(data);
      }else{
        throw Error();
      }
    } catch (error) {
      res.status(404).send("Error");
    }
});

doctorRouter.post('/update',authMiddleware,async(req,res)=>{
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

doctorRouter.post('/add',authMiddleware,async(req,res)=>{
  try {
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await addUser(collection,data);
    res.send("Sucess");
  } catch (error) {
    res.status(404).send("Error");
  }
});


doctorRouter.post('/createuser',authMiddleware,async(req,res)=>{
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

// web apis

doctorRouter.get('/:email',authMiddleware,async(req,res)=>{
  const email=req.params.email;
    const patients=await getPatientData();
    const appointments=await getDoctorAppointments(email);
    res.render('doctor/doctor_dashboard',{patient:patients,appointment:appointments,email:email,user:'doctor'});
});

doctorRouter.get('/:email/profile',authMiddleware,async(req,res)=>{
    const email=req.params.email;
    const data=await getUserProfile(email,'Doctor');
    res.render('doctor/doctor_profile',{data:data,user:'doctor'});
});

// patientlist
doctorRouter.get('/:email/patientlist',authMiddleware,async(req,res)=>{
    const email=req.params.email;
    const patients=await getPatientData();
    res.render('doctor/patients_list',{patient:patients,email:email,user:'doctor'});
});

doctorRouter.get('/:email/patientlist/:documentid/:category',authMiddleware,async(req,res)=>{
  let category=req.params.category.toLowerCase().replace(/\s/g, '');
  let patientemail=req.query.patientemail;
  let userid=req.query.userid;
  let url=`doctor/${req.params.email}/patientlist/${req.params.documentid}/${req.params.category}?patientemail=${patientemail}`;
  let email=req.params.email;
  if(category=='about'){
    const data=await getUserProfile(patientemail,'Patient');
    res.render('patient/profile_page',{patient:data,user:'doctor',email:email});
  }else if(category=='appointment'){
    const appointments=await getPatientAppointments(patientemail);
    res.render('appointments/appointment_list',{appointment:appointments,email:email,user:'doctor'});
  }
  else{ 
    // recordid,documentid,category,userid
    const data=await getCategoryData(category,req.params.documentid);
    res.render(`patient/category/${category}`,{data:data,email:email,user:'doctor'});
  }
});

// view data of a specific patient in web.
doctorRouter.get('/:email/patientlist/:documentid',authMiddleware,async(req,res)=>{
    const patientemail=req.query.patientemail;
    const userid=req.query.userid;
    let url =`doctor/${req.params.email}/patientlist/${req.params.documentid}`;
    const menuList=[
      'About','Allergy','BloodGlucose','BloodPressure',
      'Examination','Family History','Medical Visit','Notes','Pathology','Prescription','Radiology','Surgery','Vaccine','Appointment'
    ];  
    res.render('patient/menu',{user:'doctor',menuList:menuList,url:url,patientemail:patientemail,email:req.params.email,userid:userid});
});


// view all appoinments in web
doctorRouter.get('/:email/appointment',authMiddleware,async(req,res)=>{
  const email=req.params.email;
    const appointments=await getDoctorAppointments(email);
    res.render('appointments/appointment_list',{appointment:appointments,email:email,user:'doctor'});
});

module.exports=doctorRouter;