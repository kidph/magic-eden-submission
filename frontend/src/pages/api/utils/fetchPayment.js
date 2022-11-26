const mongoose = require('mongoose');
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const subscriptionModel = require('../../../schemas/subscriptionSchema');
mongoose.connect(mongoPath);

export default async function handler(req, res) {
    const mint = req.query.mint;
    const doc = await subscriptionModel.findOne({ mint: mint });

    res.json(doc);
}
