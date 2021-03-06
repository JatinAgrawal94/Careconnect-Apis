const express=require('express');
const authRouter=express();
const {signIn,signOutUser, signUpUser, updateToken}=require('../../Queryfunctions/medical/auth');
const {getRole,authMiddleware,checkDeviceType}=require('../../Queryfunctions/medical/general');

authRouter.get('/getrole',authMiddleware,async(req,res)=>{
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
});

authRouter.post('/login',async(req,res)=>{
    const email=req.body.email.toString();
    const password=req.body.password.toString();
    var result= await signIn(email,password);
    if(result.status === 1){
        const data=await getRole(email);
        if(data['role'] == 'doctor'){
            if(!checkDeviceType(req)){
                res.cookie(email,{token:result.token,refresh_token:result.refresh_token});
                res.redirect(302,`/doctor/${email}`);
            }
        }else if(data['role'] == 'admin'){
            if(!checkDeviceType(req)){
                res.cookie(email,{token:result.token,refresh_token:result.refresh_token});
                res.redirect(302,`/admin/${email}`);
            }
        }else if(data['role'] == 'patient'){
            // res.cookie(email,result.token);
            res.redirect(302,'/');
        }else{
            res.status(404).send("User Not Found")
        }
    }else{
        res.status(404).send("Login Error");
    }
});

authRouter.post('/logout',async(req,res)=>{
    var result=await signOutUser();
    const email=req.query.email;
    if(result.status===1){
        res.clearCookie(email);
        res.redirect(302,'/login');
    }else{
        res.status(404);
    }
});

// only for patients
authRouter.get('/signup',async(req,res)=>{
    let query=req.query;
    var result=await signUpUser(query.email,query.password,query.name,query.contact);
    res.send(result);
});

authRouter.get('/updatetoken',async(req,res)=>{
    var token=req.query.token;
    var data=await updateToken(token);
    if(data==0){
        res.status(404).send({message:"Invalid Token"});
    }
    res.send(data);
});

module.exports=authRouter;