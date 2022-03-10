const express=require('express');
const adminRouter=express();
const {getDocsId}=require("../../../Queryfunctions/medical/general");

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
})

module.exports=adminRouter;