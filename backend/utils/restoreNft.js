const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");
const { PublicKey, Connection, Keypair } = require("@solana/web3.js");
require("dotenv").config();
const mongoose = require("mongoose");
const userName = process.env.MONGO_DB_USERNAME;
const mongoUrl = process.env.MONGO_URL;
const mongoPath = `mongodb+srv://${userName}:${pass}${mongoUrl}`;
const collectionHashModel = require("../schemas/collectionHashSchema");
mongoose.connect(mongoPath);
const bs58 = require("bs58");
const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed"
);

async function restoreNft(mint) {
  try {
    mongoose.connect(mongoPath);
    const key = process.env.SIGNER;
    console.log(mint);
    const signer = Keypair.fromSecretKey(bs58.decode(key));

    const mintAddress = new PublicKey(mint);

    const metaplex = Metaplex.make(connection).use(keypairIdentity(signer));
    const doc = await collectionHashModel.findOne({ mint: mint });

    if (doc) {
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: mintAddress });

      await metaplex.nfts().update({ nftOrSft: nft, uri: doc.active_metadata });
      const updatedNft = await metaplex.nfts().refresh(nft);
      doc.activation_fee = "0";
      doc.active = true;
      doc.save();
      return updatedNft;
    }
  } catch (err) {
    console.log(err.message);
    return err;
  }
}

module.exports = { restoreNft };
