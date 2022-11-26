import axios from 'axios';
const apiKey = process.env.API_KEY;

export default async function handler(req, res) {
    const mint = req.query.mint;

    const url = 'https://api.nft-subscription-demo.xyz/api/refreshSubscription';
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
