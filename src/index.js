// @ts-check
'use strict';
const db = require('./db');
const getBitfinexData = require('./getBitfinexData.js');
const startMongoD = require('chalk');
const chalk = require('chalk');
// chalk colors
const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;

// call only once
db()
.then(() => {
    getBitfinexData();
    console.log(connected('Mongo Connected'));
})
.catch(() => {
    console.log(error('Mongo Connection Error'));
    startMongoD()
    .then(() => {
        getBitfinexData();
    });
});


