const { Connection } = require('@solana/web3.js');
const { getParsedNftAccountsByOwner } = require('@nfteyez/sol-rayz'); //sol-rayz package to filter tokens in wallet using Solana/Web3.js getParsedTokenAccountsByOwner
const axios = require('axios');
const mongoose = require('mongoose');
const userName = process.env.MONGO_DB_USERNAME;
const pass = process.env.MONGO_DB_PASSWORD;
const mongoPath = `mongodb+srv://${userName}:${pass}@cluster0.795zabb.mongodb.net/engagement-tracking`;
const collectionHashModel = require('../../../schemas/collectionHashSchema');
mongoose.connect(mongoPath);
let hashlist = [];

const connection = new Connection(
    'https://frosty-shy-violet.solana-mainnet.quiknode.pro/45c1c31d6e058e521eb0c8d9be91c2bc640fbfae/',
    'confirmed'
);

export default async function handler(req, res) {
    const walletAddress = req.query.walletAddress;
    //first grab hashlist from database
    //this feature allows for dynamic hashlisting
    //All mints in collection are stored with additional properties such as active/inactive
    //to facilitate easy removal from access
    try {
        async function getHashlist() {
            const docs = await collectionHashModel.find({});

            docs.forEach((doc) => {
                hashlist.push(doc.mint);
            });
        }

        //use the hashlist to get the nft objects from the wallet
        const getCollectionNfts = async () => {
            await getHashlist();
            const nftArray = await getParsedNftAccountsByOwner({
                publicAddress: walletAddress,
                connection: connection,
            });
            //map through to get the metadata from the nft uri
            const allMetadatas = await Promise.all(
                nftArray.map(async (nft, i) => {
                    if (hashlist.includes(nft.mint)) {
                        const uriData = await axios
                            .get(nft.data?.uri)
                            .then((response) => {
                                const metadata = response.data;
                                metadata.tokenAddress = nft.mint;
                                return metadata;
                            })
                            .catch((err) => {
                                //this catch helps to prevent cors errors from hanging up the process or ignoring mints completely
                                let metadata = {};
                                metadata.image = 'security risk';
                                metadata.tokenAddress = nft.mint;
                                metadata.name = nft.data.name;
                                return metadata;
                            });
                        return uriData;
                    } else {
                        return { tokenAddress: 'not in collection' };
                    }
                })
            );
            res.json(allMetadatas.filter((e) => hashlist.includes(e.tokenAddress)));
        };
        getCollectionNfts();
    } catch (err) {
        res.json(err);
    }
}
