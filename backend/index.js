require("dotenv").config();
const express = require("express");
const cors = require("cors");
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;
const app = express();
const hashlist = require("./hashlist.json");
const bodyParser = require("body-parser");
const { breakNft } = require("./utils/breakNft");
const { restoreNft } = require("./utils/restoreNft");
const { update } = require("./utils/updateDb");
const { checkSubscription } = require("./utils/checkSubscription");
const HELIUS = process.env.HELIUS_KEY;
const axios = require("axios");
const { refreshSubscription } = require("./utils/removeSubscription");
const { restoreNftSubscription } = require("./utils/restoreNftSubscription");

const corsOpts = {
  origin: ["http://localhost:3000"],

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

//middleware function to check incoming apikey on get requests
const accessGranted = (req, res, next) => {
  if (API_KEY !== req.query.key) {
    return res.status(401).json("Access Denied.");
  } else next();
};

app.use(bodyParser.json());

//Base Route
app.get("/", accessGranted, (req, res) => {
  res.status(200).json("Welcome To Corn Pop's Stuf boiiiii");
});

//endpoint to trigger breaking of nft for royalties not paid (webhook dump)
app.post("/api/helius-hook", async (req, res) => {
  try {
    if (hashlist.includes(req.body[0]?.events?.nft?.nfts[0]?.mint)) {
      const mint = req.body[0]?.events?.nft?.nfts[0]?.mint;
      console.log(mint);
      try {
        await axios
          .post(`https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS}`, {
            mintAccounts: [mint],
          })
          .then((response) => {
            console.log(response.data);
            const data = response.data;
            const tx = req.body[0]?.events?.nft?.signature;

            const creators = data[0]?.onChainData?.data?.creators?.map(
              (creator) => creator.address
            );

            if (
              !req.body[0].nativeTransfers.some((e) =>
                creators?.includes(e.toUserAccount)
              )
            ) {
              //until here is checking royalties using the webhook trigger
              //and helius api to check if sol was transferred to any of the creators
              const feeToPay =
                (req.body[0]?.events?.nft?.amount / 1000000000) *
                (data[0]?.onChainData?.data?.sellerFeeBasisPoints / 10000);

              const saleInfo = {
                mint: mint,
                didPay: false,
                feeToPay: feeToPay,
                tx: tx,
              };

              //functions to update the metadata and database to reflect a broken nft (royalties unpaid)
              async function runFuncs() {
                console.log(mint);
                const updateDatabase = await update(saleInfo);
                console.log(updateDatabase);
                const brokenNft = await breakNft(mint);
                console.log(brokenNft);
              }
              runFuncs();
            } else {
              console.log("paid");
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
    res.status(200).end();
  } catch (err) {
    console.log(err);
  }
});

//endpoint to return nft from broken state after payment is received
app.get("/api/restore", accessGranted, async (req, res) => {
  const mint = req.query.mint;
  console.log(mint);
  const restore = await restoreNft(mint);
  console.log(restore);
  res.status(200).json("successful restoration");
});

//endpoint to reinstate nft when subscription has been paid
app.get("/api/refreshSubscription", accessGranted, async (req, res) => {
  let mint = req.query.mint;
  let tx = req.query.tx;

  const result = await refreshSubscription(mint, tx);
  const updateResult = await restoreNftSubscription(mint);

  if (result === "error" || updateResult === "error") {
    res.status(200).json("error");
  } else {
    res.status(200).json("success");
  }
});

//function to run every 4 hours to check whether subscription has lapsed
(async () => {
  const result = await checkSubscription();
  console.log(result);
})();
setInterval(async () => {
  await checkSubscription();
}, 1000 * 60 * 60 * 4);

//listener for requests
app.listen(
  PORT,
  () => console.log("Server Live on Port: " + PORT) /* , "0.0.0.0" */
);
