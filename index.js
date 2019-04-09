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
  console.log(server.address().port);
});
const io = require("socket.io")(server);
const io_client = require( 'socket.io-client' );

//chat
let serv = [];
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
    serv.push(data);
    console.log("Mensaje recibido", data);
    io.sockets.emit("message_server", {
      username: socket.username,
      message: data.message
    });
  });
});

app.post("/echo", function(req, res) {
  console.log('SESSION', req.body.session)
  var speech = "Era esto?";
  var socket = io_client.connect("https://habla2.herokuapp.com/");
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

  /*setTimeout(function(){
    next();
  },10);*/

  res.json({
    fulfillmentText: speech,
    fulfillmentMessages: [
      {
        text: {
          text: [speech],//serv[serv.length-1].username+': '+serv[serv.length-1].message,
        }
      }
    ],
    source: "<webhookpn1>",
    outputContexts: [
      {
        name: req.body.session+"/contexts/humano",
        lifespanCount: 5,
        parameters: {
          param: "param value"
        }
      }
    ]
  });

  socket.on('message_server', function(data){
    console.warn('Mensaje recibido SERV CLIENT: ', data);
  })
});