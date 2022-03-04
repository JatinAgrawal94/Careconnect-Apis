const {getMessaging}=require("firebase-admin/messaging");
const axios=require('axios');
var registrationToken=process.env.REGISTRATION_TOKEN;

var message={
    data:{
        title:"Notification Title",
        body:"notification body"
    },
    token:registrationToken
};

function sendMessage(){
    getMessaging().send(message).then((response)=>{
        console.log(`Response is ${response}`);
    }).catch((error)=>{
        console.log(`Error is ${error}`);
    })
}

async function setReminder(){
    await axios.post();
}

module.exports={sendMessage};