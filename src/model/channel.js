let mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    timeFrame: {type: String, required: true},
    pair: {type: String, required: true},
    key: {type: String, required: true, index: true},
    chanId: {type: Number, required: true, index: true},
});
// static methods
channelSchema.statics.setChannel = function(data) {
    return new Promise((resolve, reject) => {
        this.findOneAndUpdate({key: data.key}, {chanId: data.chanId, timeFrame: data.timeFrame, pair: data.pair, key: data.key}, {upsert: true})
        .then((response) => {
            resolve(response);
        })
        .catch((error) => reject(error));
    });
};
channelSchema.statics.getChannel = function(data) {
    return new Promise((resolve, reject) => {
        this.findOne({chanId: data}, 'key')
        .then((response) => {
            resolve(response);
        })
        .catch((error) => reject(error));
    });
};
channelSchema.statics.getAllChannels = function(data) {
    return new Promise((resolve, reject) => {
        this.find(data)
        .then((response) => {
            resolve(response);
        })
        .catch((error) => reject(error));
    });
};

module.exports = mongoose.model('channel', channelSchema);
