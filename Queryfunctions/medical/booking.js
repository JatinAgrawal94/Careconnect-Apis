const {db}=require('../db');


async function bookTest(testtype,data){
    try {
        let ref=await db.collection('Booking');
        await ref.doc().set(
            {
                ...data,
                'testtype':testtype
            }
        );
        return 1;
    } catch (error) {
        return 0;
    }
}

async function getAllBookedTests(){
    try{
        let data=[];
        let ref=await db.collection("Booking");
        let snapshot=await ref.get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
                });
        return data;
    }catch(error){
        return {status:'0'};
    }
}

// tests for a specific patient
async function getBookedTests(patientemail){
    try {
        var data=[];
        let ref=await db.collection('Booking');
        let snapshot=await ref.where('patientemail','==',patientemail).get();
        snapshot.docs.forEach((item)=>{
            let temp=item.data();
            temp['documentid']=item.id;
            data.push(temp);
        });
        return data;
    } catch (error) {
        return {status:'0'};
    }
}

async function cancelBookedTest(documentid){
    try {
        let ref=await db.collection('Booking');
        await ref.doc(documentid).delete();
        return 1;
    } catch (error) {
        return 0;
    }
}

async function changePatientPresence(testdocumentId,presence){
    try{
        if(presence=='present'){
            let ref=await db.collection('Booking');
            await ref.doc(testdocumentId).update({'presence':'absent'});
            return {status:'1'};
        }else{
            let ref=await db.collection('Booking');
            await ref.doc(testdocumentId).update({'presence':'present'});
            return {status:'1'};
        }
    }catch(error){
        return {status:'0'};
    }
}
module.exports={changePatientPresence,getBookedTests,bookTest,cancelBookedTest,getAllBookedTests};