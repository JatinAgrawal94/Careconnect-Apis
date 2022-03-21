const express=require('express');
const authRouter=express();
const {signIn,signOutUser}=require('../../Queryfunctions/medical/auth');
const {getRole,authMiddleware,checkDeviceType}=require('../../Queryfunctions/medical/general');

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
});

authRouter.post('/login',async(req,res)=>{
    const email=req.body.email.toString();
    const password=req.body.password.toString();
    var result= await signIn(email,password);
    // localStorage.setItem(email,result.token);
    if(result.status === 1){
        const data=await getRole(email);
        if(data[0]['role'] == 'doctor') {
            if(!checkDeviceType(req)){
                res.cookie(email,result.token);
                res.redirect(302,`/doctor/${email}`);
            }
        }else if(data[0]['role'] == 'admin'){
            if(!checkDeviceType(req)){
                res.cookie(email,result.token);
                res.redirect(302,`/admin/${email}`);
            }
        }else if(data[0]['role'] == 'patient'){
            // res.cookie(email,result.token);
            // res.redirect(302,'/')
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

module.exports=authRouter;