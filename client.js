'use strict';

let
  net = require('net'),
  readline = require('readline'),
  isReachable = require('is-reachable'),
  host = process.argv[2] || 'localhost',
  port = process.argv[3] || 5000,
  client = null,
  messages = []

// Checks if a server is running
async function checkServerRunning() {
  let isServerRunning = await isReachable(`${host}:${port.toString()}`);
  return isServerRunning;
}

// Client Starter Code
async function startClient(){

  let isServerRunning = await checkServerRunning();

  // Connect only if server is running
  if(isServerRunning) {
    client = await net.connect({port: port, host: host}, function(data, err){
      client.write("Client connected");
    });
    
    client.on('data', function(data){
      data = data.toString();
      console.log(data);
    });

    client.on('end', function(){
      console.log('Server has disconnected.');
      client = null;
    });

    if(messages.length > 0) {
      messages.forEach(message => {
        client.write(message);
      });
      messages = [];
    }
  }
}

// Save messages if the server is not running
function saveMessagesToCache(message) {
  messages.push(message);
}

readline.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', async function(line){

  if(await checkServerRunning()) {
    // If client is null start client and connect to server
    if(!client) {
      await startClient();
    }
    //push message to server
    client.write(line);
  } else {
    // save to cache 
    saveMessagesToCache(line);
    console.log('Server not running');
  }
});

startClient();
