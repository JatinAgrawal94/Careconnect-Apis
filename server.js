const dotenv=require('dotenv');
dotenv.config();
const express = require("express");
const cors = require('cors');
const checksum_lib=require('./paytm/checksum.js');
const config=require('./paytm/config.js');
const app = express();
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const zoomRouter=require('./zoom.js');
const calendarRouter=require('./google-calender.js');
const webRouter=require('./web.js');
// environement variables
const CREDENTIALS=JSON.parse(process.env.CREDENTIALS);
const PORT = process.env.PORT || 4000;

// firebase initialize
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const {sendMessage}=require('./map.js');

initializeApp({
  credential: cert(CREDENTIALS)
});

const db = getFirestore();

// functions for firebase queries
const {verifyUser,getUserId,changePaymentStatus,getDistance,getLocation,getPatientData,getDoctorData,getAppointments}=require('./db.js');
const { default: axios } = require("axios");
var patientInfo={};

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/message',(req,res)=>{
  sendMessage();
  res.send('Successfull');
});

app.get("/", (req, res) => {
  res.send("This is an API");
});

// home page for payment
app.get(`/pay`,async(req,res)=>{  
  var status=await verifyUser(db,req.query.patientemail,req.query.doctoremail,req.query.date,req.query.timing,req.query.amount,req.query.customerid,req.query.phone);
  if(status){
    patientInfo={
      'cid':req.query.customerid,
      'pe':req.query.patientemail,
      'de':req.query.doctoremail,
      'ph':req.query.phone,
      'dt':req.query.date,
      'tm':req.query.timing,
      'at':req.query.amount,
    }
    res.sendFile(__dirname + "/views/index.html");
  }
  else{
    res.send('404 Error');
  }
});

app.get('/paymentend',(req,res)=>{
  res.send("Return back to CareConnect Application");
});

app.post('/callback',(req,res)=>{
  res.redirect('/paymentend');
})

// official paytm route
app.post("/paynow", [parseUrl, parseJson], (req, res) => {
    // Route for making payment
    // the keys of the req.body are converted to smaller case here.
    
    var paymentDetails = {
      amount: req.body.amount,
      customerId: req.body.customerid,
      customerEmail: req.body.patientemail ,
      customerPhone: req.body.phone 
  }


  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = config.PaytmConfig.mid;
      params['WEBSITE'] = config.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = 'http://localhost:4000/callback' || 'https://careconnect-api.herokuapp.com/callback';
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
          var form_fields = "";
          for (var x in params) {
              form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
          res.end();
      });
  }
  });

  app.get('/distance',async(req,res)=>{
    getLocation()
    var origin={
      lat:"22.307685199442744",
      lon:"73.17754902422645"
    };

    var destination={
      lat:"22.30078276005401",
      lon:"73.16911778189652"
  };
    var time=await getDistance(origin,destination);
    res.send(time);
  });

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

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});

