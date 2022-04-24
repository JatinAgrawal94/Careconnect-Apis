const {db}=require('../db');


async function bookTest(testtype,data){
    try {
        let ref=await db.collection('Booking');
        await ref.doc().set(
            {
                ...data,
                'testtype':testtype
            }
        //     {
        //     testname:testname,
        //     date:date,
        //     patientname:patientname,
        //     patientemail:patientemail,
        //     testtype:testtype,
        //     time:time,
        //     presence:'false'
        // }
        );
        return 1;
    } catch (error) {
        return 0;
    }
}

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


module.exports={getBookedTests,bookTest,cancelBookedTest};