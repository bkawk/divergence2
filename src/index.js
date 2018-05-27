// @ts-check
'use strict';
import {db} from './db';
import {getBitfinexData} from './getBitfinexData.js';
import {startMongoD} from './startMongoD.js';
import {chalk} from 'chalk';
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


