/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all the helpers
let helpers = {};


// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  else {
    return false
  }
}

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (error) {
    return {};
  }
}

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;

  if(strLength){

    // Define all the possible charaters that could go into a string
    let possibleCharaters = 'abcdefghijklmnopqrstuvwxyz0123456789'

    // Start the final string
    let str = '';
    for(let i = 1; i <= strLength; i++){

      // Get a random charater from the possibleCharacters string
      let randomCharacter = possibleCharaters.charAt(Math.floor(Math.random() * possibleCharaters.length));
      // Append this charater to the final string
      str += randomCharacter;
    }

    // Return the final string
    return str;

  }
  else {
    return false;
  }
}


// Export the module
module.exports = helpers;