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

async function getUserId(email,collection){
    try{
        var data=[];
        const docRef=db.collection(collection);
        const snapshot=await docRef.where('email','==',email).get();
        snapshot.docs.forEach((item)=>{
            data.push({
                'email':item.data()['email'],
                'phone':item.data()['phoneno'],
                'userid':item.data()['userid'],
                'documentid':item.id
        });
        })
        return data;
    }catch(err){
        console.log(err);
        return null;
    }
}

module.exports={getUserId,getPatientData};