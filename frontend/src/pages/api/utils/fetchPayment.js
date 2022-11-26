const mongoose = require('mongoose');
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoUrl = process.env.MONGO_URL;
const mongoPath = `mongodb+srv://${userName}:${pass}${mongoUrl}`;
const subscriptionModel = require('../../../schemas/subscriptionSchema');
mongoose.connect(mongoPath);

//next endpoint returning the requested document based on mint address
//endpoint is specific to the subscription model
//**find can work instead of findOne to return all instead of looping throught and making the request each time
export default async function handler(req, res) {
    const mint = req.query.mint;
    const doc = await subscriptionModel.findOne({ mint: mint });

    res.json(doc);
}
