"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();
var c = 0;

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  c++;
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText
      ? "Respuesta "+c+": Envie esto al humano \""+req.body.queryResult.parameters.echoText + " \"  El dijo esto: \"Hola soy humano\""
      : "Seems like some problem. Speak again."+req.body;

  if(c>2){
    return res.json({

      "fulfillmentText": speech,
      "fulfillmentMessages": [
        {
          "text": {
            "text": [speech]
          }
        }
      ],
      "source": "<webhookpn1>",
    
      "followupEventInput": {
        "name": "Welcome",
        "parameters": {
          "parameter-name-1": "parameter-value-1",
          "parameter-name-2": "parameter-value-2"
        }
      }
    
      });

  }else{
    return res.json({

      "fulfillmentText": speech,
      "fulfillmentMessages": [
        {
          "text": {
            "text": [speech]
          }
        }
      ],
      "source": "<webhookpn1>"
    
    
      });
  }
  
  
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

//=================================== //

restService.get("/propio", function(req, res) {
  res.send('Huascar Answer')
})