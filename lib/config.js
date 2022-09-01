/**
 * Create and export configuration variables
 */

//Conatiner for all the enviroments
let environments = {};

// Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC21613e24f57fc71ea268a3f8213b31f6',
    'authToken' : '423a4ce154ecdea0156dbf53295fdeb2',
    'fromPhone' : '+19783092919'
  }
};

//Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC21613e24f57fc71ea268a3f8213b31f6',
    'authToken' : '423a4ce154ecdea0156dbf53295fdeb2',
    'fromPhone' : '+19783092919'
  }
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
let environmenToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmenToExport;