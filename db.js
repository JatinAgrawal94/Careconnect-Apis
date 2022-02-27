// const {getFirestore,collection,getDocs, where}=require('firebase/firestore');
const { app } = require('firebase-admin');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const axios=require('axios');
// get payment amount
// get email phone user id and verify it 
// set up function for updateing the payment status

function checkEmpty(variable){
    if(variable !== undefined && variable !== null && variable.split(" ").join("") !== ""){
        return 1;
    }else{
        return 0;
    }
}

async function verifyUser(db,patientemail,doctoremail,date,timing,amount,customerid,phone){
    if(checkEmpty(patientemail) && checkEmpty(doctoremail) && checkEmpty(date) && checkEmpty(timing) && checkEmpty(customerid) && checkEmpty(phone) && checkEmpty(amount)){
        try{
            var record;
            var itemId;
            record=await verifyUserData(db,patientemail,doctoremail,date,timing);
            if(record.amount == amount)
            return 1;
            else
            throw new Error("Invalid fields");
        }catch(err){
            console.log(err);
            return 0;
        }
    }else{
        return 0;
    }
}

async function verifyUserData(db,patientemail,doctoremail,date,timing){
    var databaseAmount;
    var itemId;
    const appointmentRef=db.collection('Appointment');
    const appSnapshot=await appointmentRef.where('patientemail','==',patientemail).where('doctoremail','==',doctoremail).where('date','==',date).where('timing','==',timing).get();
    appSnapshot.docs.forEach((item)=>{
        databaseAmount=item.data()['paymentamount'];
        itemId=item.id;
    })
    return {amount:databaseAmount,itemId:itemId};
}

async function changePaymentStatus(db,patientemail,doctoremail,date,timing,amount){
    try{
        var record=await verifyUserData(db,patientemail,doctoremail,date,timing);
        
        if(!record.amount == amount) throw Error('Invalid Amount');

        const appointment=db.collection('Appointment').doc(record.itemId);
        await db.runTransaction(async(t)=>{
            const doc=await t.get(appointment);
            t.update(appointment,{'paymentstatus':'Paid'});
        });
        console.log('Update Successfull');

    }catch(err){
        console.log('Transaction Failure'+err);
    }
}

async function getUserId(db,email){
    try{
        var data=[];
        const docRef=db.collection('Patient');
        const snapshot=await docRef.where('email','==',email).get();
        snapshot.docs.forEach((item)=>{
            data.push({
                'email':item.data()['email'],
                'phone':item.data()['phoneno'],
                'userid':item.data()['email'],
        });
        })
        const appointmentRef=db.collection('Appointment');
        // doctoremail,patientemail,date,timing
        const appSnapshot=await appointmentRef.where('')
    }catch(err){
        console.log(err);
    }
}

async function getDistance(origin,destination){
    try{  
        const r=await axios.get(`https://router.hereapi.com/v8/routes?destination=${destination.lat},${destination.lon}&origin=${origin.lat},${origin.lon}&return=polyline&transportMode=car&spans=names&apiKey=${process.env.HERE_API_KEY}`)
        .then(res=>{
          let data=res.data.routes[0].sections[0];
          let result=calculateTime(data.arrival.time,data.departure.time);
          return result;
        }).catch(res=>{
          console.log(res);
        })
        return r;
        // console.log(r);
      }catch(err){
        console.log("This is error");
        return "Error getting time";
      }
}

function calculateTime(arrival,departure){
    var time1=arrival.split('T')[1].split('+')[0].split(':');
    var time2=departure.split('T')[1].split('+')[0].split(':');
    let hour=Math.abs(time1[0]-time2[0]);
    let min=Math.abs(time1[1]-time2[1]);
    let sec=Math.abs(time1[2]-time2[2]);
    return `${hour}h ${min}m ${sec}sec`;
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
  
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}

async function getPatientData(db){
    try {
        var data=[];
        const docRef=await db.collection('Patient');
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    } catch (error) {
        console.log(error);
        
    }
}

async function getDoctorData(db){
    try {
        var data=[];
        const docRef=await db.collection('Doctor');
        const snapshot=await docRef.get();
        // console.log(snapshot);
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    } catch (error) {
        console.log(error);
        
    }
}

async function getAppointments(db){
    try {
        var data=[];
        const docRef=await db.collection('Doctor');
        const snapshot=await docRef.get();
        // console.log(snapshot);
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={getUserId,verifyUser,changePaymentStatus,getDistance,getLocation,getPatientData,getDoctorData,getAppointments};