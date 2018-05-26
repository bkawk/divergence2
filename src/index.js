// @ts-check
'use strict';
const getBitfinexData = require('./getBitfinexData');
const db = require('./db');

// call only once
db();

setTimeout(function() {
    getBitfinexData();
}, 6000);
