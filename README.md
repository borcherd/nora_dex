# DINO DEX UI

An implementation of a UI for the Serum DEX.

### Running the UI

Run `yarn` to install dependencies, then run `yarn start` to start a development server or `yarn build` to create a production build that can be served by a static file server. Note that prior to compiling you need to add charts yourself (see below).

### Add Trading View charts

It is now required to add OHLCV candles built from on chain data using [Bonfida's API](https://docs.bonfida.com). Here is how to do it:

1. Get access to the [TradingView Charting Library](https://github.com/tradingview/charting_library/) repository. This is a **private repository** and it will **return a 404 if you don't have access to it**. To get access to the repository please refer to [TradingView's website](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/)

2. Once you have access to the Charting Library repository:

- Copy `charting_library` folder from https://github.com/tradingview/charting_library/ to `/public` and to `/src` folders.
- Copy `datafeeds` folder from https://github.com/tradingview/charting_library/ to `/public`.

---

See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for other commands and options.

---

See [A technical introduction to the Serum DEX](https://docs.google.com/document/d/1isGJES4jzQutI0GtQGuqtrBUqeHxl_xJNXdtOv4SdII/view) to learn more about the Serum DEX.

See [serum-js](https://github.com/project-serum/serum-js) for DEX client-side code. Serum DEX UI uses this library.

See [sol-wallet-adapter](https://github.com/project-serum/sol-wallet-adapter) for an explanation of how the Serum DEX UI interacts with wallet services to sign and send requests to the Serum DEX.

See [spl-token-wallet](https://github.com/project-serum/spl-token-wallet) for an implementation of such a wallet, live at [sollet.io](https://sollet.io).
up
