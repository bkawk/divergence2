// @ts-check
'use strict';
const nrc = require('node-run-cmd');
const tmp = require('tmp-promise');
const util = require('util');
/**
 * A function to start mongod and set the dbpath
 * @return {Promise} message The array of prices
 */
module.exports = function startMongoD() {
    return new Promise((resolve, reject) => {
        tmp.dir({prefix: 'mongo_'})
        .then((directory) => {
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
};
