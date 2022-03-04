const express=require('express');
const calenderRouter=express();
const dotenv=require('dotenv');
dotenv.config();
const {google} = require('googleapis');
const calendar = google.calendar('v3');
// const CREDENTIALS=JSON.parse(process.env.CREDENTIALS);
const CREDENTIALS=JSON.parse(process.env.CREDENTIALS);

// const CREDENTIALS=JSON.parse(process.env.CREDENTIALS);

calenderRouter.post('/create',async(request,response)=>{
  try{
    const auth = new google.auth.GoogleAuth({
      // Scopes can be specified either as an array or as a single, space-delimited string.
      credentials:{client_email:CREDENTIALS.client_email,private_key:CREDENTIALS.private_key},
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
    const authClient = await auth.getClient();
    google.options({auth: authClient});
    const res = await calendar.events.insert({
      // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
      calendarId: 'p248had81ump88t9gdj07d4t6s@group.calendar.google.com',
      // Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0.
      // conferenceDataVersion: 'placeholder-value',
      // The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
      // maxAttendees: 'placeholder-value',
      // Whether to send notifications about the creation of the new event. Note that some emails might still be sent. The default is false.
      sendUpdates: 'all',
      // Whether API client performing operation supports event attachments. Optional. The default is False.
      // supportsAttachments: 'placeholder-value',
  
      // Request body metadata
      requestBody: {
        // request body parameters
        // {
        //   "anyoneCanAddSelf": false,
        //   "attachments": [],
      //   Add patients to this list.
          // "attendees": [{email:'jatinagrawal.180410107002@gmail.com'}],
          
        //   "attendeesOmitted": false,
        //   "colorId": "my_colorId",
          "conferenceData": {createRequest: {
              requestId: '1123',
              conferenceDataVersion:'1',
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        //   "created": "my_created",
      //   add name of creator here.
          // "creator": {displayName:"Jatin Agrawal",email:"jatinagrawal0801@gmail.com"},
          "description": "This is description",
          "end": {dateTime:'2022-02-20T11:00:00+05:30'},
        //   "endTimeUnspecified": false,
        //   "etag": "my_etag",
        //   "eventType": "my_eventType",
        //   "extendedProperties": {},
        //   "gadget": {},
          "guestsCanInviteOthers": false,
          "guestsCanModify": false,
          "guestsCanSeeOtherGuests": false,
        //   "hangoutLink": "my_hangoutLink",
        //   "htmlLink": "my_htmlLink",
        //   "iCalUID": "my_iCalUID",
        //   "id": "my_id",
        //   "kind": "my_kind",
        //   "location": "my_location",
        //   "locked": false,
          "organizer": {displayName:"Jatin Agrawals",email:"jatinagrawal0801@gmail.com"},
        //   "originalStartTime": {},
        //   "privateCopy": false,
        //   "recurrence": [],
        //   "recurringEventId": "my_recurringEventId",
          // "reminders": {},
        //   "sequence": 0,
        //   "source": {},
          "start": {dateTime:"2022-02-12T10:00:00+05:30"},
        //   "status": "my_status",
          "summary": "This is summary",
        //   "transparency": "my_transparency",
        //   "updated": "my_updated",
        //   "visibility": "my_visibility"
        // }
      },
    });
    const v=res.data;
    response.send(v);

  }catch(err){
    console.log(err);
  }
});

module.exports=calenderRouter;
/*
async function main() {
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    credentials:{client_email:CREDENTIALS.client_email,private_key:CREDENTIALS.private_key},
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });

  // Acquire an auth client, and bind it to all future calls
  const authClient = await auth.getClient();
  google.options({auth: authClient});
  

  // Do the magic
  const res = await calendar.events.insert({
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
    calendarId: process.env.CALENDER_ID,
    // Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0.
    // conferenceDataVersion: 'placeholder-value',
    // The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
    // maxAttendees: 'placeholder-value',
    // Whether to send notifications about the creation of the new event. Note that some emails might still be sent. The default is false.
    sendUpdates: 'all',
    // Whether API client performing operation supports event attachments. Optional. The default is False.
    // supportsAttachments: 'placeholder-value',

    // Request body metadata
    requestBody: {
      // request body parameters
      // {
      //   "anyoneCanAddSelf": false,
      //   "attachments": [],
    //   Add patients to this list.
        // "attendees": [{email:'jatinagrawal.180410107002@gmail.com'}],
        
      //   "attendeesOmitted": false,
      //   "colorId": "my_colorId",
        "conferenceData": {createRequest: {
            requestId: '1123',
            conferenceDataVersion:'1',
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      //   "created": "my_created",
    //   add name of creator here.
        // "creator": {displayName:"Jatin Agrawal",email:"jatinagrawal0801@gmail.com"},
        "description": "This is description",
        "end": {dateTime:'2022-02-12T11:00:00+05:30'},
      //   "endTimeUnspecified": false,
      //   "etag": "my_etag",
      //   "eventType": "my_eventType",
      //   "extendedProperties": {},
      //   "gadget": {},
        "guestsCanInviteOthers": false,
        "guestsCanModify": false,
        "guestsCanSeeOtherGuests": false,
      //   "hangoutLink": "my_hangoutLink",
      //   "htmlLink": "my_htmlLink",
      //   "iCalUID": "my_iCalUID",
      //   "id": "my_id",
      //   "kind": "my_kind",
      //   "location": "my_location",
      //   "locked": false,
        "organizer": {displayName:"Jatin Agrawals",email:"jatinagrawal0801@gmail.com"},
      //   "originalStartTime": {},
      //   "privateCopy": false,
      //   "recurrence": [],
      //   "recurringEventId": "my_recurringEventId",
        // "reminders": {},
      //   "sequence": 0,
      //   "source": {},
        "start": {dateTime:"2022-02-12T10:00:00+05:30"},
      //   "status": "my_status",
        "summary": "This is summary",
      //   "transparency": "my_transparency",
      //   "updated": "my_updated",
      //   "visibility": "my_visibility"
      // }
    },
  });
  console.log(res.data);

  // Example response
  // {
  //   "anyoneCanAddSelf": false,
  //   "attachments": [],
  //   "attendees": [],
  //   "attendeesOmitted": false,
  //   "colorId": "my_colorId",
  //   "conferenceData": {},
  //   "created": "my_created",
  //   "creator": {},
  //   "description": "my_description",
  //   "end": {},
  //   "endTimeUnspecified": false,
  //   "etag": "my_etag",
  //   "eventType": "my_eventType",
  //   "extendedProperties": {},
  //   "gadget": {},
  //   "guestsCanInviteOthers": false,
  //   "guestsCanModify": false,
  //   "guestsCanSeeOtherGuests": false,
  //   "hangoutLink": "my_hangoutLink",
  //   "htmlLink": "my_htmlLink",
  //   "iCalUID": "my_iCalUID",
  //   "id": "my_id",
  //   "kind": "my_kind",
  //   "location": "my_location",
  //   "locked": false,
  //   "organizer": {},
  //   "originalStartTime": {},
  //   "privateCopy": false,
  //   "recurrence": [],
  //   "recurringEventId": "my_recurringEventId",
  //   "reminders": {},
  //   "sequence": 0,
  //   "source": {},
  //   "start": {},
  //   "status": "my_status",
  //   "summary": "my_summary",
  //   "transparency": "my_transparency",
  //   "updated": "my_updated",
  //   "visibility": "my_visibility"
  // }
}

main().catch(e => {
  console.error(e);
  throw e;
});*/