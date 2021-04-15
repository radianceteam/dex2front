# dex2front
## dev mode
```
git clone https://github.com/radianceteam/dex2front.git
cd dex2front
yarn install
yarn serve
```
Go to http://localhost:8088

## prod mode

```

yarn build
yarn start
```
Go to http://localhost:3000


## async getNetwork()
- return  `{id: 1, server: "main.ton.dev", explorer: "main.ton.live"}`
- return  `{id: 2, server: "net.ton.dev", explorer: "net.ton.live"}`

## async getWallet()
- return  `{wallet: <address>, balance: <uint128>}`

## async getPublicKey()
- return  `{pubkey: <uint256>}`

## async checkDEXclient(<pubkey>)
- if DEXclient exist in DEXroot return  `{dexclient: <address>}`
- if DEXclient !exist in DEXroot return  `{dexclient: <address(0)>}`

## async createDEXclient(<pubkey>)
- return  `{dexclient: <address>}`

## async getDEXclient(<dexclient>)
- return  `{connectedRoots: <address[]>}`

## async getDEXclientBalances(connectedRoots)
- return  `{balances: [{symbol:<string>,balance:<uint128>}]}`

## async getTokenList()

## async setTokenList()

## async getDEXpairs()

## async createDEXpairs()

## async provideLiquidity()

## async selectLiquidity()

## async wrapTONtoDEX()

## async unwrapTONfromDEX()

## async swapA()

## async swapB()

## async transferToken()
