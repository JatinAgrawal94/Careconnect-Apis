const {google} = require('googleapis');
const dotenv=require("dotenv");
dotenv.config();


async function main(){
    try {
        
        const sheets=google.sheets({
            version:'v4',
            auth:process.env.SHEETS_API_KEY  
            });
        const res=await sheets.spreadsheets.get({
            ranges:["Radiology_Test_Names!A2:A12"],
            includeGridData:true,
            spreadsheetId:"1v0MuJjL4JC6HgPRvTouZbQ76Tb_yef4lBIncSB1QA7E"
        });
        var response=res.data.sheets;
        response[0].data[0].rowData.forEach((element)=>{
            console.log(element.values[0].formattedValue);
        });
    } catch (error) {
        console.log(error);   
    }
}

main();