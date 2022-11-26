import axios from 'axios';
const apiKey = process.env.API_KEY; //api key is necessary for access to private api

//next endpoint to handle restoring nfts broken due to subscription lapse.
//This is front run by a sol transaction of the monthly/weekly/etc... fee.  Can be dynamic (percentage of floor price) or fixed.
export default async function handler(req, res) {
    const mint = req.query.mint;

    const url = 'https://api.nft-subscription-demo.xyz/api/refreshSubscription'; //private api hosted outside of next for tx signing.
    try {
        axios
            .request(url, {
                params: {
                    key: apiKey,
                    mint: mint,
                },
            })
            .then((response) => {
                res.json(response.data);
            })
            .catch((err) => {
                console.log(err);
                res.json('error');
            });
    } catch (err) {
        console.log(err);
    }
}
