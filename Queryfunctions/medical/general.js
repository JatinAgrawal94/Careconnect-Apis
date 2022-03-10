const {db}=require('../db');

async function getDocsId(email,collection){
    try{
        var data=[];
        const docRef=db.collection(collection);
        const snapshot=await docRef.where('email','==',email).get();
        snapshot.docs.forEach((item)=>{
            data.push({
                'email':item.data()['email'],
                'phoneno':item.data()['phoneno'],
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

async function getUserInfo(documentId,collection){
    try {
        const ref=db.collection(collection).doc(documentId);
         const data=await ref.get();
         if (!data.exists) {
            return null
          } else {
            return data.data();
          }
    } catch (error) {
        return null;
    }
}

async function addUser(collection,data){
    try {
        var numbers=[];
        db.collection(collection).doc().set(data);
        const ref=db.collection('stats');
        let snapshot=await ref.get();
        snapshot.docs.forEach((item)=>{
            numbers.push({
                'noofpatients':item.data()['noofpatients'],
                'noofdoctors':item.data()['noofdoctors'],
                'noofadmin':item.data()['noofadmin'],
                'documentid':item.id
            });
        });
        var value;
        if(collection === 'Patient'){
            value=parseInt(numbers[0]['noofpatients'])+1;
            await db.collection('stats').doc(numbers[0]['documentid']).update({'noofpatients':value.toString()});
        }else if(collection === 'Doctor'){
            value=parseInt(numbers[0]['noofdoctors'])+1;
            await db.collection('stats').doc(numbers[0]['documentid']).update({'noofdoctors':value.toString()});
        }
        return 1;
    } catch (error) {
        return null;
    }
}

async function updateUserData(documentId,data,collection){
    try {
        const ref=await db.collection(collection).doc(documentId).update(data);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

async function increementNoOfUsers(documentid,number,userRole){
    try {
        var role='noOf'+userRole+'s';
        let data={};
        data[role]=number.toString();
        db.collection('stats').doc(documentid).update(data);
        return 1;
    } catch (error) {
        return 0;
    }
}

module.exports={getDocsId,getUserInfo,updateUserData,addUser};