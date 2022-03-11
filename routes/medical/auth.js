const express=require('express');
const authRouter=express();
const {getRole}=require('../../Queryfunctions/medical/general');

authRouter.get('/getrole',async(req,res)=>{
    try {
        const email=req.query.email;
        const data=await getRole(email);
        if(data){
            res.send(data);
        }else{
            throw Error;
        }
    } catch (error) {
        res.send("Error");
    }
})

module.exports=authRouter;