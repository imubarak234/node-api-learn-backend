/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const https = require('https')
const { StringDecoder } = require('string_decoder');
const url = require('url');
//const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
// const _data = require('./lib/data');



// Testing
// @TODO delete this
// _data.create('test','newFile', {'foo' : 'bar'}, function(err){
//   console.log('this was the error', err)
// });

// _data.read('test', 'newFile', function(err, data){
//   console.log('this was the error ', err, 'and this was the data ', data)
// });

// _data.update('test', 'newFile', { 'fizz' : 'buzz' }, function(err){
//   console.log('this was the error ', err)
// });

// _data.delete('test', 'newFile', function(err){
//   console.log('this was the error ', err)
// });

// Instantiate the HTTP server
let httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);  
});

//Start the server
httpServer.listen(config.httpPort, function() {
  console.log("The server is listening on port "+config.httpPort);
});

// Instantiate the HTTPS server
let httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/-cert.pem'),
};

let httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res);  
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function() {
  console.log("The server is listening on port "+config.httpsPort);
});


// All the server logic for the http and https server
let unifiedServer = function(req, res){
  // Get the URL and parse it
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //Get the query string as an object
  let queryStringObject = parsedUrl.query;

  //Get the HTTP Method
  let method = req.method.toLowerCase();

  // Get the headers as an object
  let headers = req.headers


  // Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data);
  });
  req.on('end', function(){
    buffer += decoder.end();

    // Choose the handler this request should go to. if one is not found use the not found hanler
    let ChoosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the hanler specified in the router
    ChoosenHandler(data, function(statusCode,payload){

      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      //USe the payload called back by the handler, or default to an empty onject
      payload = typeof(payload) == 'object' ? payload : {};

      // Covert the payload to string
      let payloadString = JSON.stringify(payload);

      // Return the reponse
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning this responses: ', statusCode, payloadString);
    });

  });
};


// Define a request router
let router = {
  'ping' : handlers.ping,
  'users' : handlers.users
};