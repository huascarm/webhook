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

var limite = 4;
restService.post("/echo", function(req, res) {
  c++;
  var speech = '';
  if(req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.echoText){
    if(c < limite-1){
      speech = "Respuesta "+c+": Envié esto al humano: \""+req.body.queryResult.parameters.echoText + " \", y el dijo esto: \"Hola soy humano\"";
    }else{
      speech = "El humano se desconectó.";
    }
  }else{
    speech = "Tengo problemas para entender. Repite por favor "+req.body;
  }
  

  if(c>=limite){
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