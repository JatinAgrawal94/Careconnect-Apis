const {getFirestore,collection,getDocs}=require('firebase/firestore');

async function getUserId(db,email,role){
    var data=[]
    const temp=collection(db,'users');
    const snapshot=await getDocs(temp);
    snapshot.docs.forEach((item)=>{
        data.push(item.data());
    })
    const result=data.filter(item=>(item.email==email&& item.role == role));
    console.log(result);
}

module.exports=getUserId;