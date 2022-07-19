/**
 * Primary file for the API
 */

//Dependencies
const http = require('http');

//The sever should respond to all requests with a string
let server = http.createServer(function(req, res) {
  res.end('Hello World \n');
});

//Start the server, and have it listen on port 3000

server.listen(3000, function() {
  console.log("The server is listening on port 3000 now");
});