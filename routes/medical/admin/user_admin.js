const express=require('express');
const adminRouter=express();
const {getDocsId,getUserInfo,updateUserData,getUserProfile,authMiddleware}=require("../../../Queryfunctions/medical/general");
const {getPatientData}=require('../../../Queryfunctions/medical/patient/user_patient')
const {getDoctorData}=require('../../../Queryfunctions/medical/doctor/user_doctor');

// api for mobile apps
adminRouter.get('/getdocsid',authMiddleware,async(req,res)=>{
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

adminRouter.get('/info',authMiddleware,async(req,res)=>{
    const documentid=req.query.documentid;
    const collection=req.query.collection;
    try {
      const data=await getUserInfo(documentid,collection);
      if(data){
        res.send(data);
      }else{
        throw error;
      }
    } catch (error) {
      res.status(404).send("Error");
    }
})

adminRouter.post('/update',authMiddleware,async(req,res)=>{
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
// website routes
adminRouter.get('/:email',authMiddleware,async(req,res)=>{
    // show no of doctors and patients in card format
    const email=req.params.email;
    const patients=await getPatientData();
    const doctor=await getDoctorData();
    res.render('admin/admin_dashboard',{patient:patients,doctor:doctor,email:email,admin:"1"});
});

// admin profile
adminRouter.get('/:email/profile',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  const data=await getUserProfile(email,'Admin');
  res.render('admin/admin_profile',{data:data});
});

// patientlist
adminRouter.get('/:email/patientlist',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  const patients=await getPatientData();
  res.render('admin/patients_list',{patient:patients,email:email});
});

// doctorlist
adminRouter.get('/:email/doctorlist',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  const doctors=await getDoctorData();
  res.render('admin/doctor_list',{doctor:doctors,email:email});
});

// patient profile
adminRouter.get('/:email/patientlist/:patientemail/profile',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  const patientemail=req.params.patientemail;
  const data=await getUserProfile(patientemail,'Patient');
  res.render('patient/profile_page',{patient:data,email:email,isAdmin:true});
});


// doctor profile
adminRouter.get('/:email/doctorlist/:doctoremail/profile',authMiddleware,async(req,res)=>{
  const email=req.params.email;
  const doctoremail=req.params.doctoremail;
  const data=await getUserProfile(doctoremail,'Doctor');
  res.render('doctor/doctor_profile',{data:data,isAdmin:true,email:email});
});

module.exports=adminRouter;