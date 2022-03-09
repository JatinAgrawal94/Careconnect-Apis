const {db}=require('./../db');

function createReminder(timings,email,medicineName){
    // fields patientemail,dateofcreation, reminder-> medicineName,dosage,time.
    db.collection('Patient/doc/reminder')
//   patient/documentId/reminder/documentId

}

function deleteReminder(email,medicineName,reminderId){
    db.collection('Patient/doc/reminder')
}