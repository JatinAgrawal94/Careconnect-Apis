const express=require('express');
const adminRouter=express();
const {getDocsId,getUserInfo,updateUserData}=require("../../../Queryfunctions/medical/general");

adminRouter.get('/getdocsid',async(req,res)=>{
    try {
        const email=req.query.email;
        const role=req.query.role;
        const data=await getDocsId(email,role);
        if(data){
          res.send(data);
        }else{
          throw error;
        }
      } catch (error) {
        res.status(404).send("Error");
      }
});

adminRouter.get('/info',async(req,res)=>{
    const documentid=req.query.documentid;
    const role=req.query.role;
    try {
      const data=await getUserInfo(documentid,role);
      if(data){
        res.send(data);
      }else{
        throw error;
      }
    } catch (error) {
      res.status(404).send("Error");
    }
})

adminRouter.post('/update',async(req,res)=>{
  try {
    let documentid=req.body.documentid;
    let collection=req.body.collection;
    let data=JSON.parse(req.body.data);
    await updateUserData(documentid,data,collection);
    res.send("Sucess");
  } catch (error) {
    res.status(404).send("Error");
  }
});

module.exports=adminRouter;