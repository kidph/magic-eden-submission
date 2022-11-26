# Royalty/Subscription NFT Backend API

This is the source code for the backend API used to handle non-paid royalties, metadata updates and subscription lapses. This pairs with the front end included in this repo and a Mongo DB to handle a dynamic hashlist of nft mints to restrict token-based access to community, tools or shared revenue.

---

## Features

- API key protected endpoints
- Automated Subscription Checking
- Metadata switching
- Automated Hashlist access

---

## Setup

1. Clone this repo to your desktop and run

```
npm install or yarn intall
```

to install all the dependencies.

---

2.  Change the name of the `.env.example` to just `.env`

---

3.  Change the values in the `.env` to your own values

```
PORT=<Desired Port>
MONGO_DB_PASSWORD=<Mongo DB Password>
MONGO_DB_USERNAME=<Mongo DB Username>
MONGO_URL:Connection string following username and password
CORAL_KEY=<Coral Cube Api Key>
HELIUS_KEY=<Helius Api Key>
SIGNER=<Private Key of Update Authority Wallet in BS58>
API_KEY: <Tempory Api Key>
```

---

5.  Purchase a Helius api key. <https://helius.xyz>

---

6.  Use Helius to run a webhook using the following settings:

```
Webhook Type: Enhanced
Transaction Type: NFT_SALE
Webhook URL: The url to your private endpoint
Account Address: Below are the contract addresses for the top Solana Marketplaces

Magic Eden: M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K
Hyperspace: HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8
YAWWW: 5SKmrbAxnHV2sgqyDXkGrLrokZYtWWVEEk5Soed7VLVN
Exlixir: 2qGyiNeWyZxNdkvWHc2jT5qkCnYa1j1gDLSSUmyoWMh8
Solanart: hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk
Hadeswap: hadeK9DLv9eA7ya5KCTqSvSvRZeJC3JgD5a9Y3CNbvu
```

---

7. Run the server locally using:

```

npm start or yarn start

```

This will launch your backend server on localhost:8080 or whatever port you have specified.

---

## Usage

Once you've completed the setup, read through the code and take a look at the comments.

Upon launching, you should be good to go!

---

## License

This project is licensed under the terms of the **MIT** license.
