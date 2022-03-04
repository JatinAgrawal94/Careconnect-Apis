// const axios=require('axios');
const {db}=require('./db');

function checkEmpty(variable){
    if(variable !== undefined && variable !== null && variable.split(" ").join("") !== ""){
        return 1;
    }else{
        return 0;
    }
}

async function verifyUser(patientemail,doctoremail,date,timing,amount,customerid,phone){
    if(checkEmpty(patientemail) && checkEmpty(doctoremail) && checkEmpty(date) && checkEmpty(timing) && checkEmpty(customerid) && checkEmpty(phone) && checkEmpty(amount)){
        try{
            var record;
            var itemId;
            record=await verifyUserData(patientemail,doctoremail,date,timing);
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

async function verifyUserData(patientemail,doctoremail,date,timing){
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

async function changePaymentStatus(patientemail,doctoremail,date,timing,amount){
    try{
        var record=await verifyUserData(patientemail,doctoremail,date,timing);
        
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

module.exports={verifyUser,changePaymentStatus};