// @ts-check
'use strict';
const db = require('./db');
const nrc = require('node-run-cmd');
const util = require('util');
const getBitfinexData = require('./getBitfinexData');
const tmp = require('tmp-promise');
const chalk = require('chalk');
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
    startMongoD().then(()=>{
        getBitfinexData();
    });
  });
  /**
   * A function to start mongod and set the dbpath
   * @return {Promise} promise
   */
function startMongoD() {
    return new Promise((resolve, reject)=>{
        tmp.dir({prefix: 'mongo_'}).then((directory) => {
            console.log('db path: ', directory.path);
            let mongodCmd = util.format('mongod --dbpath=%s', directory.path);
            let processCallback = function(output) {
                console.log(output);
                if (output.toString().indexOf('waiting for connections on port 27017') > -1) {
                    resolve();
                }
            };
            let errorCallback = function(output) {
                reject();
            };
            nrc.run(mongodCmd, {onData: processCallback, onError: errorCallback});
    });
    });
}

