let mongoose = require('mongoose');

const divergenceSchema = new mongoose.Schema({
    columns: {type: Array, required: true},
    direction: {type: String, required: true},
    type: {type: String, required: true},
    period: {type: Number, required: true},
    pair: {type: String, required: true},
    timeFrame: {type: String, required: true},
    localTime: {type: String, required: true},
    time: {type: Number, required: true},
});
// static methods
divergenceSchema.statics.setDivergence = function(data) {
    return new Promise((resolve, reject) => {
        this.findOneAndUpdate({localTime: data.localTime, pair: data.pair, timeFrame: data.timeFrame}, {columns: data.columns, direction: data.direction, type: data.type, period: data.period, pair: data.pair, timeFrame: data.timeFrame, localTime: data.localTime, time: data.time}, {upsert: true})
        .then((response) => {
            resolve(response);
        })
        .catch((error) => reject(error));
      });
};
module.exports = mongoose.model('divergence', divergenceSchema);
