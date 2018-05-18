'use strict';
//Import the mongoose module
const mongoose = require('mongoose');
// Define schemas
var Schema = mongoose.Schema;
var channelSchema = new Schema({
    timeFrame: {type: String, required: true},
    pair: {type: String, required: true},
    key: {type: String, required: true, index: true},
    chanId: {type: Number, required: true, index: true}
});
var priceSchema = new Schema({
    pair: {type: String, required: true}, 
    time: {type: Number, required: true}, 
    timeFrame: {type: String, required: true}, 
    localTime: {type: String, required: true}, 
    open: {type: Number, required: true}, 
    close: {type: Number, required: true}, 
    high: {type: Number, required: true}, 
    low: {type: Number, required: true}, 
    volume: {type: Number, required: true},
    rsi: {type: Number},
    priceSpike: {type: String},
    rsiSpike: {type: String}
});
// compound indexes
priceSchema.index({localTime:1,pair:1,timeFrame:1});
// Create models 
const Channel = mongoose.model('channel', channelSchema);
const Price = mongoose.model('price', priceSchema);

// connection options
const options = {
    autoIndex: true, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 7, // Maintain up to 10 socket connections
    bufferMaxEntries: 0,
    bufferCommands: false,
    keepAlive: true,
};
//Set up default mongoose connection
mongoose.connect('mongodb://localhost/divergence', options)
//mongoose.createConnection('mongodb://localhost/divergence', options)
.then(
    () => { console.log('Mongo Connected') },
    err => { console.log('Mongo Connection Error') }
);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// turn debugging on
mongoose.set('debug', true);
//Get the default connection
const mdb = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
mdb.on('error', console.error.bind(console, 'connection error:'));

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mdb.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
}); 

/**
 * get subscriptions
 * @param {number} timeFrames The value to the left of target
 * @param {number} pairs The tagets value
 * @param {number} apiUrl The value to the right of target
 * @return {string} the string indicating direction
 */
module.exports = function db(data, model) {
    return new Promise((resolve, reject) => {
        if(model === 'setChannel') {
            Channel.findOneAndUpdate({key: data.key}, {chanId: data.chanId, timeFrame: data.timeFrame, pair: data.pair, key: data.key},{upsert:true})
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        }
        if(model === 'setPrice') {
            Price.findOneAndUpdate({localTime: data.localTime, pair: data.pair, timeFrame: data.timeFrame}, {time: data.time, pair: data.pair, timeFrame: data.timeFrame, localTime: data.localTime, open: data.open, close: data.close, high: data.high, low: data.low, volume: data.volume},{upsert:true})
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        }
        if(model === 'getChannel') {
            Channel.findOne({chanId: data})
            .then((response) => resolve(response))
            .catch((error) => reject(error))
        }
        if(model === 'getAllChannels') {
            Channel.find(data, {pair, timeFrame}).lean()
            .then(response => resolve(response))
            .catch((error) => reject(error))
        }
        if(model === 'getAllPrices') {
            Price.find(data).sort({localTime: -1}).lean()
            .then(response => resolve(response))
            .catch((error) => reject(error))
        }
        if(model === 'setRsi') {
            Price.findOneAndUpdate({_id: data.id},{rsi: data.rsi})
            .then(response => resolve(response))
            .catch((error) => reject(error))
        }
        if(model === 'setSpikes') {
            Price.findOneAndUpdate({_id: data.id},{priceSpike: data.priceSpike, rsiSpike: data.rsiSpike})
            .then(response => resolve(response))
            .catch((error) => reject(error))
        }
    })
}

