const mongoose = require('mongoose');
const DB_URI = 'mongodb+srv://kosch71:Kostya190@cluster0.b4stj.mongodb.net/lab4?retryWrites=true&w=majority';

function connect() {
    return new Promise((resolve, reject) => {

        if (process.env.NODE_ENV === 'test') {
            const Mockgoose = require('mockgoose').Mockgoose;

            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage()
                .then(() => {
                    mongoose.connect(DB_URI,
                        { useNewUrlParser: true, useCreateIndex: true })
                        .then((res, err) => {
                            if (err) return reject(err);
                            resolve();
                        })
                })
        } else {
            mongoose.connect(DB_URI,
                { useNewUrlParser: true, useCreateIndex: true })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
        }
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };
