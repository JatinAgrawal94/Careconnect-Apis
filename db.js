// const {getFirestore,collection,getDocs, where}=require('firebase/firestore');
const { app } = require('firebase-admin');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

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

module.exports={getUserId,verifyUser,changePaymentStatus}