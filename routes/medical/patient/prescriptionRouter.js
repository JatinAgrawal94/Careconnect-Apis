const express=require('express');
const preRouter=express();


preRouter.post('/create',async(req,res)=>{
    // const appointmentRef=db.collection('Patient');
});

// // excrypt the documentId from the app 
// // prepare and api key 
// // 1) to authenticate with the nodejs api
// // 2) to decrypt/encrypt the documentId and data send over the api.

// preRouter.get('/get',async(req,res)=>{
//     const appointmentRef=db.collection('Patient');
// });


module.exports=preRouter;