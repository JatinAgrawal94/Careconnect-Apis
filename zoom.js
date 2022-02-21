const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require("request");

const zoomRouter = express();

// create a meeting
// req params time,date
// parameters doctoremail,patientemail,date,timing in appointment, return a zoom link,password. and add it to db from nodejs itself.
// check them first.
zoomRouter.post("/create", (req, res) => {
    const playload = req.body;
    const date=req.params.date.split('/').reverse().join('-');
    const time=req.params.time;

    const config = {
      token:process.env.ZOOM_ACCESS_TOKEN,
      email: "jatinagrawal0801@gmail.com",
    };
    try {
      var options = {
        url: `https://api.zoom.us/v2/users/${config.email}/meetings`,
        method: "POST",
        auth: {
          bearer: config.token,
        },
        json: true,
        body: {
          // add patient name in meeting
           topic: "Zoom Meetings",
           
           type: 2,
           start_time: "2022-02-05T02:00:00",
           duration:30,
           end_time:"2022-02-05T02:30:00",
           timezone:"Asia/Calcutta",
           schedule_for:'jatinagrawal0801@gmail.com'
        },
      };
      request(options, (error, response, body) => {
        // console.log(response.statusCode);
        if (!error && response.statusCode === 201) {
            // console.log(response);
          res.send({ message: "meeting has been successfully created ",data:response.body});
        } else {
          // console.log(body);
          res.send({ message: body.message});
        }
      });
    } catch (e) {
      res.status(500).send(e.toString());
    }  
});

zoomRouter.get("/get-meetings", (req, res) => {
  // const playload = req.body;
  const config = {
    token:process.env.ZOOM_ACCESS_TOKEN,
    email: "jatinagrawal0801@gmail.com",
  };
  try {
    var options = {
      url: `https://api.zoom.us/v2/users/${config.email}/meetings`,
      method: "GET",
      auth: {
        bearer: config.token,
      },
      json: true,
    };
    request(options, (error, response, body) => {
      // console.log(response.statusCode);
      if (!error && response.statusCode === 201) {
          // console.log(response);
        res.send({ message: "meeting has been successfully created ",data:response.body});
      } else {        
        // console.log(body);
        res.send({ message: body.message});
      }
    });
  } catch (e) {
    res.status(500).send(e.toString());
  }  
});

module.exports=zoomRouter;