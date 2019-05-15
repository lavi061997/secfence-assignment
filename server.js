'use strict';

let
  net = require('net'),
  port = process.argv[2] || 5000,
  socket = null
//Server Starter Code
function startServer(){
  net.createServer(function (s) {
    if(socket) return s.end("Sorry error occured!");

    socket = s;

    socket.on('data', function (data) {
      data = data.toString();
      socket.write(data);
    });

    socket.on('end', function(){
      console.log('Client has disconnected');
      socket = null;
    });

  }).listen(port);

  console.log("Server running at port "+port);
}

startServer();


