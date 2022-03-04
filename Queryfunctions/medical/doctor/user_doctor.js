const {db}=require('../../db');

async function getDoctorData(){
    try {
        var data=[];
        const docRef=await db.collection('Doctor');
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

module.exports={getDoctorData};