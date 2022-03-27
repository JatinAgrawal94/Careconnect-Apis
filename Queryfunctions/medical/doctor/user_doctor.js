const {db}=require('../../db');

async function getDoctorData(){
    try {
        var data=[];
        const docRef=await db.collection('Doctor');
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
        });
        return data;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

// async function createDoctorAppointments(){
//     try {
//         let ref=await db.collection('Appointment');
//         await ref.doc().add();
//     } catch (error) {
        
//     }
// }

module.exports={getDoctorData};