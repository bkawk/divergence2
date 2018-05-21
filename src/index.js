'use strict';
const getBitfinexData = require('./getBitfinexData');
const getDivergenceData = require('./getDivergenceData');
const memwatch = require('memwatch-next');
// const heapdump = require('heapdump');
memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
    // heapdump.writeSnapshot((err, filename) => {
    //     if (err) console.error(err);
    //     else console.error('Wrote snapshot: ' + filename);
    // });
  });
memwatch.on('stats', function(stats) {
    console.log(stats);
});
(() => {
    getBitfinexData();
    getDivergenceData();
})();
