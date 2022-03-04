const {db}=require('../db.js');

async function getAppointments(){
    try {
        var data=[];
        const docRef=await db.collection('Appointment');
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            data.push(item.data());
        });
        return data;
    } catch (error) {
        console.log(error);   
    }
}

module.exports={getAppointments};