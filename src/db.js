// @ts-check
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const divergenceSchema = new Schema({
    columns: {type: Array, required: true},
    direction: {type: String, required: true},
    type: {type: String, required: true},
    period: {type: Number, required: true},
    pair: {type: String, required: true},
    timeFrame: {type: String, required: true},
    localTime: {type: String, required: true},
    time: {type: Number, required: true},
});
const channelSchema = new Schema({
    timeFrame: {type: String, required: true},
    pair: {type: String, required: true},
    key: {type: String, required: true, index: true},
    chanId: {type: Number, required: true, index: true},
});
const priceSchema = new Schema({
    pair: {type: String, required: true},
    time: {type: Date, required: true},
    timeFrame: {type: String, required: true},
    localTime: {type: String, required: true},
    open: {type: Number, required: true},
    close: {type: Number, required: true},
    high: {type: Number, required: true},
    low: {type: Number, required: true},
    volume: {type: Number, required: true},
    rsi: {type: Number},
    priceSpike: {type: String},
    rsiSpike: {type: String},
});

priceSchema.index({time: 1, pair: 1, timeFrame: 1});

const Divergence = mongoose.model('divergence', divergenceSchema);
const Channel = mongoose.model('channel', channelSchema);
const Price = mongoose.model('price', priceSchema);


const options = {
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 9,
    bufferMaxEntries: 0,
};

if (!mongoose.connection.readyState) {
    mongoose.connect('mongodb://localhost/divergence', options)
    .then(() => {
        console.log('Mongo Connected');
    },
    (err) => {
        console.log('Mongo Connection Error');
    }
);
}

mongoose.Promise = global.Promise;
mongoose.set('debug', false);

/**
 * Database functions
 * @param {object} data The data needed to compllete the database transaction
 * @param {string} model The model to insert the data into
 * @return {object} object containing the requested data or the confirmation
 */
module.exports = function db(data, model) {
    return new Promise((resolve, reject) => {
        if (model === 'setEnhance') {
            Price.insertMany(data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'batchPrice') {
            Price.insertMany(data)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'setDivergence') {
            Divergence.findOneAndUpdate({localTime: data.localTime, pair: data.pair, timeFrame: data.timeFrame}, {columns: data.columns, direction: data.direction, type: data.type, period: data.period, pair: data.pair, timeFrame: data.timeFrame, localTime: data.localTime, time: data.time}, {upsert: true})
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'setChannel') {
            Channel.findOneAndUpdate({key: data.key}, {chanId: data.chanId, timeFrame: data.timeFrame, pair: data.pair, key: data.key}, {upsert: true})
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'setPrice') {
            Price.findOneAndUpdate({localTime: data.localTime, pair: data.pair, timeFrame: data.timeFrame}, {time: data.time, pair: data.pair, timeFrame: data.timeFrame, localTime: data.localTime, open: data.open, close: data.close, high: data.high, low: data.low, volume: data.volume}, {upsert: true})
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'getChannel') {
            Channel.findOne({chanId: data})
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'getAllChannels') {
            Channel.find(data).lean()
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
        if (model === 'getAllPrices') {
            Price.find(data).sort({time: -1}).limit(100).lean()
            .then((response) => {
                resolve(response);
            })
            .catch((error) => reject(error));
        }
    });
};
