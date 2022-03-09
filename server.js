const dotenv=require('dotenv');
dotenv.config();
const express = require("express");
const cors = require('cors');
const app = express();
require('ejs');
const cookieParser=require('cookie-parser');
const axios=require('axios');
const doctorRouter=require('./routes/medical/doctor/user_doctor');
const patientRouter=require('./routes/medical/patient/user_patient');
const appointmentRouter=require('./routes/medical/appointment.js');
const messagingRouter=require('./routes/messaging');
const zoomRouter=require('./routes/zoom.js');
const calendarRouter=require('./routes/google-calender.js');
const paymentRouter=require('./routes/paymentRouter');
const mapRouter=require('./routes/map');
const prescriptionRouter=require('./routes/medical/patient/prescriptionRouter');
// var date=new Date();
// var currentTime=`${date.getHours()}:${date.getMinutes()}`;

const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
// app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render('index');
});

// app.get('/home',(req,res)=>{
//   res.render('index');
// })

app.get('/callback',(req,res)=>{
  res.send("Hello ji");
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

app.get('/login',(req,res)=>{
  res.render('login_page');
});

app.use('/zoom',zoomRouter);
app.use('/calender',calendarRouter);
app.use('/payment',paymentRouter);
app.use('/messaging',messagingRouter);
app.use('/map',mapRouter);
app.use('/patient',patientRouter);
app.use('/doctor',doctorRouter);
app.use('/appointment',appointmentRouter);

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});

