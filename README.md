# Broken NFT

## A sample NFT collection to demonstrate royalty enforcement and ancillery revenue

---

![broken](https://user-images.githubusercontent.com/97425666/204115020-4edb6cfb-4f76-4202-bd03-c09155ff5595.png)


The demo site with description is available here ---> <https://nft-subscription-demo.xyz>

Clearly, royalties are a tricky subject in the Solana NFT space. Social convention is not enforceable with code using the current tech and tools available. I'm proposing two possible solutions for NFT projects. The first, to control art and access of the collection to make royalty a component in hand with ownership. The second is an alternative revenue model focused on access and benefit control through subscription based payments.

## Preface

Hi. I wanted to provide some background information as a preface to my proposed options to give context to my ask for collaboration! I wrote my first javascript code earlier this year. I'm sure while auditing this code you will find some inefficiencies! Please submit pull requests or comments on improvements! As much as this is an attempt to solve a problem, it is also a learning experience and a challenge to myself!

## Solution 1 - Royalties

While this proposal doesn't enforce royalties on-chain, it offers a solution to current and upcoming projects to control access to community, tools or revenue sharing.

### &nbsp;&nbsp;&nbsp;&nbsp; <u>How it works</u>

- A webhook monitors for nft sales from the major Solana NFT marketplaces and dumps to an endpoint on a private api.
- Each event triggers a function to check the mint against a hashlist of mints inside a collection
- Each mint that matches is then checked for royalty payment (did sol transfer in tx to creators) and ignored if royalty was paid
- If royalty was not paid, two functions run... One to update a database hosting a dynamic hashlist with data about the mint and it's state. Example NFT object below...

```
{
   mint: 'mintaddress569034jkdf3wiow', -String
   active: false, -Boolean
   active_metadata: 'https://arweave.net/dfgionowie', -String
   inactive_metadata: 'https://arweave.nft/erogj', -String
   royalty_fee: 0.24, -Float or String to be parsed
   last_sale_tx: '509jj9h9405nv34t03...' - String
}
```

- Dashboard that will display active and inactive nfts and the fee require to activate (metadata reflects active/inactive state)

![dasha](https://user-images.githubusercontent.com/97425666/204115029-cbbf4bfe-4501-4173-b4a8-87eb63d8a02f.JPG)


- Upon payment, backend triggers two functions again. One to update database to clear fee and restore access, the other to put the active metadata and image back in place.

&nbsp;&nbsp;&nbsp;&nbsp; There are notable places for improvement... The first being my inexperience with Rust. The dynamic hashlist and updating mechanics can be written as solana programs. Secondly, there are some ineffeciencies that could be ironed out interacting with the database (for loop vs bulk data sends)

## Solution 2 - Subscription

Instead of minting a project and paying royalties on sales, my second proposal offers an alternative. This incentivizes a majority of NFT consumers and project leaders. Switch the model to subscription based. Each month a payment is required to maintain access to the features and benefits offered with a project. It creates a revenue source for the project, reduces initial mint risk for speculators, gives an option to traders not to forfeit trade profits and provides exclusivity to those interested in holding.

### &nbsp;&nbsp;&nbsp;&nbsp; <u>How it works</u>

- A listener on a database monitors each mint for it's subscription renewal date.
- If that date has passed, it triggers an update of the image and metadata as well as updates the database to inactivity and payment required.
- Similarly to the royalties the database hosts the dynamic hashlist each NFT being it's own object like shown below

```
{
   mint: 'mintaddress569034jkdf3wiow', -String
   active: false, -Boolean
   active_metadata: 'https://arweave.net/dfgionowie', -String
   inactive_metadata: 'https://arweave.nft/erogj', -String
   subscription_renew: 1959999609543 -Integer (unix timestamp in ms)
   subscription_fee: 0.24, -Float or String to be parsed
   last_payment_tx: '509jj9h9405nv34t03...' - String
}
```

- Dashboard that will display active and inactive nfts and the fee require to activate (metadata reflects active/inactive state)

![dashb](https://user-images.githubusercontent.com/97425666/204115033-282a19d8-4f19-46d0-b50c-3377706ca579.JPG)


- Upon payment, backend triggers two functions again. One to update database to clear fee and restore access, the other to put the active metadata and image back in place.

&nbsp;&nbsp;&nbsp;&nbsp; There are notable places for improvement... The first being my inexperience with Rust. The dynamic hashlist and updating mechanics can be written as solana programs. Secondly, there are some ineffeciencies that could be ironed out interacting with the database (for loop vs bulk data sends)

## More information can be found in the frontend and backend readmes as well as comments on the code!

---

## Video Walkthrough

https://user-images.githubusercontent.com/97425666/204110712-b8f24375-213d-4265-b566-aa1baea27b18.mp4

---

## Features

- Dashboard to allow users to pay unpaid royalties and unlock nft
- Dashboard to allow users to pay their monthly/weekly subscription
- API key protected endpoints
- Automated Subscription Checking
- Metadata switching
- Automated Hashlist access
- Basic Template for handling transactions

---

## Setup

1. Clone this repo to your desktop
2. CD into either backend or frontend folders

```
cd ./backend
cd ./frontend
```

3. Install dependencies

```
npm install or yarn intall
```

to install all the dependencies.

---

2.  Change the name of the `.env.example` to just `.env`

---

3.  Change the values in the `.env` to your own value

---

4. Run on local dev server by using:

<u>Frontend</u>

```
npm run dev
or
yarn run dev
```

<u>Backend</u>

```
npm start
or
yarn start
```

---

## Usage

Code is pretty well commented along with styling files. This is a basic template and by no means a production ready dashboard. Feel free to use components for your own build or edit mine.

Again, please submit pull requests or reach out about improvements or if you'd like to work together on tightening up this project!!

---

## License

This project is licensed under the terms of the **MIT** license.
