const dotenv=require('dotenv');
dotenv.config();
const express = require("express");
const cors = require('cors');
const app = express();
require('ejs');
const cookieParser=require('cookie-parser');
const adminRouter=require('./routes/medical/admin/user_admin');
const doctorRouter=require('./routes/medical/doctor/user_doctor');
const patientRouter=require('./routes/medical/patient/user_patient');
const appointmentRouter=require('./routes/medical/appointment.js');
const messagingRouter=require('./routes/messaging');
const zoomRouter=require('./routes/zoom.js');
const calendarRouter=require('./routes/google-calender.js');
const paymentRouter=require('./routes/paymentRouter');
const mapRouter=require('./routes/map');
const authRouter=require('./routes/medical/auth');
const fileupload=require('express-fileupload');

const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit:'100mb'}));
app.use(cors());
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(fileupload());

app.get('/',(req,res)=>{
  res.redirect('/login');
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get('/login',(req,res)=>{
  res.render('login');
});

app.get('/callback',(req,res)=>{
  res.send("Callback");
});

// app.post('/reminder/create',async(req,res)=>{
//   const response=await axios.post('https://reminders-api.test/api/applications/',{
//     headers:{
//       'Content-Type':'application/json',
//       'Authorization':`Bearer ${process.env.REMINDER_API_TOKEN}`
//     },
//     data:{
//       'name':"careconnect",
//       'default_reminder_time_tz':'12:31:00',
//       "webhook_url":"http://localhost:4000/callback"
//     }
//   });
//   console.log(response);
//   res.send("OK")
// })

app.use('/zoom',zoomRouter);
app.use('/calender',calendarRouter);
app.use('/payment',paymentRouter);
app.use('/messaging',messagingRouter);
app.use('/map',mapRouter);
app.use('/patient',patientRouter);
app.use('/doctor' ,doctorRouter);
app.use('/admin' ,adminRouter);
app.use('/appointment',appointmentRouter);
app.use('/auth',authRouter);

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});
