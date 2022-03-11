const {db}=require('../db.js');

async function getAppointments(email){
    try {
        var data=[];
        const docRef=await db.collection('Appointment').where('patientemail','==',email);
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
        });
        return data;
    } catch (error) {
        console.log(error);   
    }
}

// function count(elements) {
//     var map = Map();
//     elements.forEach((element) {
//       if (!map.containsKey(element)) {
//         map[element] = 1;
//       } else {
//         map[element] += 1;
//       }
//     });
//     return map;
//   }

function count(elements){
    var map=Map();
    elements.forEach((item)=>{
        if(!map.has(item)){
            map[item]=1;
        }else{
            map[item]+=1;
        }
    });
    return map;
}

async function getAppointmentDates(doctoremail){}

async function getPatientsBasedOnDateAndDoctor(doctoremail){
  // data object contains all the appointments of the doctor. 
 var data=[];
 let ref=await db.collection('Appointment').where('doctoremail','==',doctoremail);
 const snapshots=await ref.get();
 snapshots.docs.forEach((item)=>{
    let temp=item.data();
    temp['documentid']=item.id;
    data.push(temp);
 });


}
module.exports={getAppointments};