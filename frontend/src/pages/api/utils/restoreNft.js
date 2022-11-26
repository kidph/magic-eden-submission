import axios from 'axios';
const apiKey = process.env.API_KEY; //api key is necessary to grant access to the backend hosted outside of next.
const apiRestoreUrl = process.env.API_RESTORE_URL;
//next endpoint to handle restoring nfts broken due to unpaid royalties.
//This is front run by a sol transaction of the calcuated amount of royalties on the transaction with unpaid.
export default async function handler(req, res) {
    const mint = req.query.mint;

    const url = apiRestoreUrl; //private api to handle tx signing.
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
                res.json(err.message);
            });
    } catch (err) {
        console.log(err);
    }
}
