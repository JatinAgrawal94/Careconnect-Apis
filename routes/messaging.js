const express=require('express');
const messagingRouter=express();

messagingRouter.get('/message',(req,res)=>{
    sendMessage();
    res.send('Successfull');
});

messagingRouter.post('/setreminder',(req,res)=>{
    try{
        
    }catch(err){}
});

module.exports=messagingRouter;