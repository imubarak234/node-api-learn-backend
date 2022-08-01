/**
 * Request handlers
 */

// Dependencies

//Define the handlers
let handlers = {};

handlers.ping = function(data, callback){
  callback(200);
}

// Not found handler
handlers.notFound = function(data, callback){
  callback(404);
};

// Export thr module
module.exports = handlers