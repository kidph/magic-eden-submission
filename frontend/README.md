# Royalty/Subscription NFT Front End

This is the source code for the front end portion of my submission to the royalty/ancillery revenue hackathon.

The demo site with description is available here ---> <https://nft-subscription-demo.xyz>

Royalties are an important part of a projects continued revenue and continued drive to produce. Paired with the backend and a Mongo Database, I've proposed a solution for NFT projects to use to attempt to

A: Remove access for NFTs for which royalties were not paid (Dynamic Hashlist and Automated Metadata changes)

B: Offer an ancillery revenue opportunity by switching to a subscription based models.

Both use similar mechanics under the hood, but operate differently. A detailed explaination can be found on the main repo README.

---

## Video Walkthrough

https://user-images.githubusercontent.com/97425666/204110712-b8f24375-213d-4265-b566-aa1baea27b18.mp4

---

## Features

-   Dashboard to allow users to pay unpaid royalties and unlock nft
-   Dashboard to allow users to pay their monthly/weekly subscription
-   Automated Haslist fetching and NFT filtering
-   Basic Template for handling transactions

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
MONGO_DB_USERNAME=Database username
MONGO_DB_PASSWORD=Database password
MONGO_URL:Connection string following username and password
API_KEY=Generated Api Key
API_URL=Private api url
```

---

4. Run on local dev server by using:

```
npm run dev
or
yarn run dev
---

## Usage

Code is pretty well commented along with styling files.  This is a basic template and by no means a production ready dashboard.  Feel free to use components for your own build or edit mine.

---

## License

This project is licensed under the terms of the **MIT** license.
```
