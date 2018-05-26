// @ts-check
'use strict';
const getBitfinexData = require('./getBitfinexData');
const memwatch = require('memwatch-next');
memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
    // process.exit(0);
});

setTimeout(function() {
    getBitfinexData();
}, 6000);
