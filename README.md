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


## getNetwork()
- return  `{id: 1, server: "main.ton.dev", explorer: "main.ton.live"}`
- return  `{id: 2, server: "net.ton.dev", explorer: "net.ton.live"}`

## getWallet()
- return  `{wallet: <address>, balance: <uint128>}`

## getPublicKey()
- return  `{pubkey: <uint256>}`

## checkDEXclient(<pubkey>)
- if `DEXclient` exist in `DEXroot` return  `{dexclient: <address>}`
- if `DEXclient` !exist in `DEXroot` return  `{dexclient: <address(0)>}`

## createDEXclient(<pubkey>)
- return  `{dexclient: <address>}`

## getDEXclient(<dexclient>)
- return  `{connectedRoots: <address[]>}`

## getDEXclientBalances(connectedRoots)
- return  `{balances: [{symbol:<string>,balance:<uint128>}]}`

## getTokenList()

## setTokenList()

## getDEXpairs()

## createDEXpairs()

## provideLiquidity()

## selectLiquidity()

## wrapTONtoDEX()

## unwrapTONfromDEX()

## swapA()

## swapB()

## transferToken()
