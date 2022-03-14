const express=require('express');
const authRouter=express();
const {signIn,signOutUser}=require('../../Queryfunctions/medical/auth');
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
});

authRouter.post('/login',async(req,res)=>{
    const email=req.body.email.toString();
    const password=req.body.password.toString();
    var result=await signIn(email,password);
    if(result.status === 1){
        const data=await getRole(email);
        if(data[0]['role'] == 'doctor') {
            authRouter.locals.authenticated=true;
            res.redirect(302,`/doctor/${email}`);
        }else if(data[0]['role'] == 'admin'){
            res.redirect(302,`/admin/${email}`);
        }else{
            res.status(404).send("User Not Found")
        }
    }else{
        res.status(404).send("Login Error");
    }
});

authRouter.post('/logout',async(req,res)=>{
    var result=await signOutUser();
    if(result.status===1){
        res.redirect(302,'/login');
    }else{
        res.status(404);
    }
});

module.exports=authRouter;