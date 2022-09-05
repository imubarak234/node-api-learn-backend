/**
 *  Worker-related tasks
 */

// Dependencies 
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');


// Instantiate the worker object
const workers = {};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = function(){

  // Get all the checks 
  _data.list('checks', function(err, checks){
    if(!err && checks && checks.length > 0){
      checks.forEach(function(check){

        // Read in the check data 
        _data.read('checks', check, function(err, originalCheckData){
          if(!err && originalCheckData){

            // Pass it to the check validator, and let that function continue or log errors as needed
            workers.validateCheckData(originalCheckData);
          }
          else {
            console.log("Error reading one of the checks data");
          }
        });
      });
    }
    else {
      console.log('Error: Could not find any checks to process');
    } 
  });
};


// Sanity-check the check-data
workers.validateChackData = function(originalCheckData){

  originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
  originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.trim() : false;
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
  originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;


};

// Timer to execute the worker-process once per minute
workers.loop = function(){
  setInterval(function(){
    workers.gatherAllChecks();
  },1000 * 60);
};

// init script
workers.init = function(){

  // Execute all the checks immediately
  workers.gatherAllChecks();

  // Call the loop so the checks will execute later on
  workers.loop();
}

// Export the module
module.exports = workers;