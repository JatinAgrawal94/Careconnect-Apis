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
    var map=new Map();
    elements.forEach((item)=>{
        if(!map.has(item)){
            map[item]=1;
        }else{
            map[item]+=1;
        }
    });
    return map;
}

async function getAppointmentDates(doctoremail){
    // email,timing,docuemntid,dateArray,dateoccurences.
    try {
        var date=[];
        var data=[];
        let ref=await db.collection('Appointment');
        const snapshots=await ref.where('doctoremail','==',doctoremail).get();
        snapshots.docs.forEach((item)=>{
           date.push(item.data()['date']);
           data.push({'timing':item.data()['timing'],'documentid':item.id});
        });
        let dateOccurence=count(date);
        
        return [date,dateOccurence,data];
    } catch (error) {
        console.log(error);
        return null;   
    }
}

async function getPatientsBasedOnDateAndDoctor(doctoremail,date){
  // data object contains all the appointments of the doctor. 
  try{
      var data=[];
      let ref=await db.collection('Appointment');
      const snapshots=await ref.where('doctoremail','==',doctoremail).where('date','==',date).get();
      snapshots.docs.forEach((item)=>{
         let temp=item.data();
         temp['documentid']=item.id;
         data.push(temp);
      });
      return data;
  }catch(err){
    return null;
  }
}

async function createAppointment(data){
    try {
        data['delete']=0;
        if((data['appointmenttype']).toString().toLowerCase() == "online"){
            var zoom;
            var ref=await db.collection('Doctor');
            var snapshot=await ref.where('email','==',data['doctoremail']).get();
            snapshot.docs.forEach((item)=>{
                zoom=item.data()['zoom'];
            });
            data['zoom']=zoom;
            await db.collection('Appointment').doc().set(data);
        }else{
            await db.collection('Appointment').doc().set(data);
        }
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

module.exports={getAppointments,getAppointmentDates,getPatientsBasedOnDateAndDoctor,createAppointment};