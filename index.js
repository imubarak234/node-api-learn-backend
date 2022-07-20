/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const { StringDecoder } = require('string_decoder');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

//The sever should respond to all requests with a string
let server = http.createServer(function(req, res) {

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


    // Send the response
    res.end('Hello World \n');

    // Log the request path
    console.log('Request recived wuth this payload: ', buffer);

  });

  
});

//Start the server, and have it listen on port 3000

server.listen(3000, function() {
  console.log("The server is listening on port 3000 now");
});