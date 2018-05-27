// require chalk module to give colors to console text
const chalk = require('chalk');
const mongoose = require('mongoose');
const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;
const dbURL = 'mongodb://localhost/divergence';

// connection options
const options = {
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 9,
    bufferMaxEntries: 0,
};

// set all events
mongoose.connection.on('connected', function() {
    console.log(connected('Mongoose default connection is open to ', dbURL));
});

mongoose.connection.on('error', function(err) {
    console.log(error('Mongoose default connection has occured '+ err +' error'));
});

mongoose.connection.on('disconnected', function() {
    console.log(disconnected('Mongoose default connection is disconnected'));
});
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log(termination('Mongoose default connection is disconnected due to application termination'));
        process.exit(0);
    });
});

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

/**
 * An object just to handle connection and the configuration
 * @return {Promise} promise
 */
module.exports = function() {
    return mongoose.connect(dbURL, options);
};
