/**
 *  Library for storing and rotating logs
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Container for the module
const lib = {};

// Base directiory of the data folder
lib.baseDir = path.join(__dirname, '/../.logs/');




// Export the module
module.exports = lib;