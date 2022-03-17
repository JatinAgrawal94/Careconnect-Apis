const {db}=require('../db.js');

// get all appointment for a doctor.
async function getDoctorAppointments(email,date=null){
    try {
        var data=[];
        var docRef;
        if(date==null){
            docRef=await db.collection('Appointment').where('doctoremail','==',email);
        }else{
            docRef=await db.collection('Appointment').where('doctoremail','==',email).where('date','==',date);
        }
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
        });
        return data;
    } catch (error) {
        return null;
    }
}

async function getPatientAppointments(email,date=null){
    try {
        var data=[];
        var docRef;
        if(date==null){
            docRef=await db.collection('Appointment').where('patientemail','==',email);
        }else{
            docRef=await db.collection('Appointment').where('patientemail','==',email).where('date','==',date);
        }
        const snapshot=await docRef.get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
        });
        return data;
    } catch (error) {
        return null;
    }
}


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

// function to check if user can add an appointment it can have only 1 appointment in a day for a particular doctor.
async function checkUserValidity(doctoremail,patientemail,date){
    try {
        var data=[];
        let ref=db.collection('Appointment');
        let snapshot=await ref.where('doctoremail','==',doctoremail).where('patientemail','==',patientemail).where('date','==',date).get();
        snapshot.docs.forEach((item)=>{
            if(item!==null){
                data.push(item.data()['patientemail']);
            }
        });
        if(data.length === 1){
            return 0;
        }else{
            return 1;
        }
    } catch (error) {
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
        return 0;
    }
}

async function updatepaymentamount(doctoremail,patientemail,date,paymentamount,paymentstatus){
    try {
        var documentId;
        const ref=db.collection('Appointment');
       var snapshot=await ref.where('doctoremail','==',doctoremail).where('paymentstatus','==',paymentstatus).where('patientemail','==',patientemail).where('date','==',date).get();
        snapshot.docs.forEach((item)=>{
            documentId=item.id;
        });
        await ref.doc(documentId).update({'paymentamount':paymentamount});
        return 1;
    } catch (error) {
        return null;
    }
}

module.exports={updatepaymentamount,getDoctorAppointments,getPatientAppointments,getAppointmentDates,getPatientsBasedOnDateAndDoctor,createAppointment,checkUserValidity};