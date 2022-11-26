var mongoose = require('mongoose');
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`; //replace with string to your database if using Mongo Atlas
var db = mongoose.createConnection(mongoPath);

var collectionHashSchema = mongoose.Schema({
    mint: String,
    holder: String,
    lastSale: Date,
    active: Boolean,
    active_image: String,
    active_metadata: String,
    broken_image: String,
    broken_metadata: String,
});
//Can set your own properties of each document
var collectionHashModel = db.model('collectionHash', collectionHashSchema, 'collectionHash');

module.exports = collectionHashModel; // export the model to be used
