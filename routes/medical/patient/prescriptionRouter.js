const express=require('express');
const preRouter=express();
const {db}=require('../../../Queryfunctions/db');

// preRouter.post('/create',async(req,res)=>{
//     // data would be sent by the app itself so we donot need to decide that.
//     // we can set the category of the data as url parameter so we can make a common call for that.
//     const patientId=req.body.patientId ;
//     // const data={
//     //     "data":"09/03/22",
//     //     "type":"Stomach Allergy",
//     //     "delete":0
//     // };
//     // const ref=await db.collection(`Patient/${patientId}/allergy`).doc().set(data);

//     res.send("Ok")
// });

// // // excrypt the documentId from the app 
// // // prepare and api key 
// // // 1) to authenticate with the nodejs api
// // // 2) to decrypt/encrypt the documentId and data send over the api.

// // preRouter.get('/get',async(req,res)=>{
// //     const appointmentRef=db.collection('Patient');
// // });
module.exports=preRouter;