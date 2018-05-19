module.exports = function getChannel(key) {
    return new Promise((resolve, reject) => {
        try {
            const item = key.split(':');
            timeFrame = item[1];
            pair = item[2];
            obj = {pair, timeFrame};
            resolve(obj);
        } catch (error) {
            reject(error);
        }
    });
};
