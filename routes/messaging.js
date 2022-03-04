const express=require('express');
const messagingRouter=express();

messagingRouter.get('/message',(req,res)=>{
    sendMessage();
    res.send('Successfull');
});

module.exports=messagingRouter;