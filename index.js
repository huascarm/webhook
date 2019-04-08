"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

//ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//socket
let server = app.listen(process.env.PORT || 8000, function() {
  console.log(server.listening);
});
const io = require("socket.io")(server);

//chat
app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", socket => {
  console.log("Usuario Conectado");
  socket.username = "Anonimo";

  socket.on("change_username", data => {
    console.log("Username cambiado");
    socket.username = data.username;
  });

  socket.on("message_client", data => {
    console.log("Mensaje recibido", data);
    io.sockets.emit("message_server", {
      username: socket.username,
      message: data.message
    });
  });
});

app.post("/echo", function(req, res) {
  var speech = "";
  var socket = io.connect("https://habla2.herokuapp.com/");

  if (
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText
  ) {
    socket.emit("message_client", {
      message: req.body.queryResult.parameters.echoText,
      username: "bot"
    });
  }

  socket.on('message_server', function(data){
    console.warn('Mensaje recibido SERV CLIENT: ', data);
    res.json({
      fulfillmentText: speech,
      fulfillmentMessages: [
        {
          text: {
            text: data.username+': '+data.message,
          }
        }
      ],
      source: "<webhookpn1>",
      outputContexts: [
        {
          name:
            "projects/huascar1/agent/sessions/" +
            req.body.sessionId +
            "/contexts/humano",
          lifespanCount: 5,
          parameters: {
            param: "param value"
          }
        }
      ]
    });
  })

  //respuesta

});

/*
var c = 0;

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

var limite = 3;
restService.post("/echo", function(req, res) {
  
  c++;
  var speech = '';
  if(req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.echoText){
    if(c < limite){
      speech = "Respuesta "+c+": Envié esto al humano: \""+req.body.queryResult.parameters.echoText + " \", y el dijo esto: \"Hola soy humano\"";
    }else{
      speech = "El humano se desconectó.";
    }
  }else{
    speech = "Tengo problemas para entender. Repite por favor "+req.body;
  }
  

  if(c>=limite){
    c=0;
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
    
      "outputContexts": [
        {
          "name": "projects/huascar1/agent/sessions/"+req.body.sessionId+"/contexts/bot",
          "lifespanCount": 5,
          "parameters": {
            "param": "param value"
          }
        }
      ],
    
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
      "source": "<webhookpn1>",
      "outputContexts": [
        {
          "name": "projects/huascar1/agent/sessions/"+req.body.sessionId+"/contexts/humano",
          "lifespanCount": 5,
          "parameters": {
            "param": "param value"
          }
        }
      ],
    
    
      });
  }
  
  
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

//=================================== //

restService.get("/propio", function(req, res) {
  res.send('Huascar Answer')
})*/
