var mongoose = require('mongoose');
require('dotenv').config();
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`; //replace with string to your database if using Mongo Atlas
var db = mongoose.createConnection(mongoPath);

var subscriptionSchema = mongoose.Schema({
    mint: String,
    active: Boolean,
    active_image: String,
    active_metadata: String,
    broken_image: String,
    broken_metadata: String,
    subscription_fee: String,
    subscription_renew: String,
    payment_transaction: String,
});
//Can set your own properties of each document
var subscriptionModel = db.model('subscription', subscriptionSchema, 'subscription');

module.exports = subscriptionModel; // export the model to be used
