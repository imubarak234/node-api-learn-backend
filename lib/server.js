/**
 * Server-related tasks
 */

//Dependencies
const http = require('http');
const https = require('https')
const { StringDecoder } = require('string_decoder');
const url = require('url');
//const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');
// const _data = require('./lib/data');

/**
 * @TODO GET RID OF THIS
 */
// helpers.sendTwilioSms('+2348091902743', 'Hello!', function(err){
//   console.log('this was the error', err);
// });




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



// Instantiate the server module object
let server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function(req, res) {
  server.unifiedServer(req, res);  
});



// Instantiate the HTTPS server
server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(path.join(__dirname, '/../https/-cert.pem'))),
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
  unifiedServer(req, res);  
});




// All the server logic for the http and https server
server.unifiedServer = function(req, res){
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
    let ChoosenHandler = typeof(server.router[trimmedPath]) != 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer),
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

      // If the response is 200, print green otherwise print red
      if(statusCode  == 200){
        debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
      }
      else{
        debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
      }
      
    });

  });
};


// Define a request router
server.router = {
  'ping' : handlers.ping,
  'users' : handlers.users,
  'tokens' : handlers.tokens,
  'checks' : handlers.checks,
};

// Init script
server.init = function() {

  //Start the server
  server.httpServer.listen(config.httpPort, function() {
    console.log('\x1b[31m%s\x1b[0m', "The server is listening on port "+config.httpPort);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function() {
    console.log('\x1b[32m%s\x1b[0m', "The server is listening on port "+config.httpsPort);
  });
};


// Export the module
module.exports = server;