const {db}=require('../../db.js');

async function getPatientData(){
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
        return 0;
    }
}

async function getUserId(email){
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

module.exports={getUserId,getPatientData};