const mongoose = require('mongoose');
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const collectionHashModel = require('../../../schemas/collectionHashSchema');
mongoose.connect(mongoPath);

export default async function handler(req, res) {
    const mint = req.query.mint;
    const doc = await collectionHashModel.findOne({ mint: mint });

    res.json(doc);
}
