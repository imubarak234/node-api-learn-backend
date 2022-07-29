/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = requirr('path');

// Container for the module (to be exported)
let lib = {};

// Base directiory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function(dir, file, data, callback){
  // Open the file writing
  fs.open(lib.baseDir+dir+"/"+file+'.json', 'wx', function(err,fileDescriptor){
    if(!err && fileDescriptor){

      // Covert data to string
      let stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(err){
        if(!err){
          fs.close(fileDescriptor, function(err){
            if(!err){
              callback(false);
            }
            else {
              callback("error closing new file")
            }
          })
        }
        else{
          callback("Error writing to new file");
        }
      })
    }
    else{
      callback('Could no create new file, it may already exist');
    }
  })
};

// Export the module 
module.exports = lib;