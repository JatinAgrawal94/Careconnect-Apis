const dotenv=require('dotenv');
dotenv.config();
const express = require("express");
const cors = require('cors');
const app = express();
const ejs=require('ejs');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const doctorRouter=require('./routes/medical/doctor/user_doctor');
const patientRouter=require('./routes/medical/patient/user_patient');
const appointmentRouter=require('./routes/medical/appointment.js');
const messagingRouter=require('./routes/messaging');
const zoomRouter=require('./routes/zoom.js');
const calendarRouter=require('./routes/google-calender.js');
const paymentRouter=require('./routes/paymentRouter');
const mapRouter=require('./routes/map');

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.send("This is an API");
});

app.get('/home',(req,res)=>{
  res.render('index');
})

app.get('/web/patientdata',async(req,res)=>{
  const data=await getPatientData(db);
  res.send(data);
});

app.get('/web/doctordata',async(req,res)=>{
  const data=await getDoctorData(db);
  res.send(data);
});

app.get('/web/appointments',async(req,res)=>{
  const data=await getAppointments(db);
  res.send(data);
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

