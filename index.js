/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');
const url = require('url');

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


  // Send the response
  res.end('Hello World \n');

  // Log the request path
  console.log('Request received on path: ' + trimmedPath + ' whith method: ' + method + ' and with these query string parameters: ', queryStringObject);
});

//Start the server, and have it listen on port 3000

server.listen(3000, function() {
  console.log("The server is listening on port 3000 now");
});