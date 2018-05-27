let mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
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

// composite index
priceSchema.index({localTime: 1, pair: 1, timeFrame: 1});
// unique index related to insertMany
// to define unique row, what pair, on which time frame and time/localtime
// priceSchema.index({pair: 1, time: 1, timeFrame: 1, localTime: 1}, {unique: true});

// static methods
priceSchema.statics.setEnhance = function(data) {
    return new Promise((resolve, reject) => {
        this.insertMany(data, (err, docs) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(docs);
        });
    });
};
priceSchema.statics.batchPrice = function(data) {
    return new Promise((resolve, reject) => {
        // docs, options, callback
        // set it to proceed
        this.insertMany(data, {ordered: false}, (err, docs) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(docs);
        });
    });
};
priceSchema.statics.setPrice = function(data) {
    return new Promise((resolve, reject) => {
        this.findOneAndUpdate({localTime: data.localTime, pair: data.pair, timeFrame: data.timeFrame}, {time: data.time, pair: data.pair, timeFrame: data.timeFrame, localTime: data.localTime, open: data.open, close: data.close, high: data.high, low: data.low, volume: data.volume}, {upsert: true})
        .then((response) => {
            resolve(response);
        })
        .catch((error) => reject(error));
    });
};
priceSchema.statics.getAllPrices = function(data) {
    return new Promise((resolve, reject) => {
        this.find(data).sort({time: -1}).limit(100).lean()
        .then((response) => {
            resolve(response);
        })
        .catch((error) => reject(error));
    });
};
module.exports = mongoose.model('price', priceSchema);
