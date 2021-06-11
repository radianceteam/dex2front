import {libWeb} from "@tonclient/lib-web";
const { ResponseType } = require("@tonclient/core/dist/bin");
const {
    MessageBodyType,
    TonClient,
} = require("@tonclient/core");
const { Account } = require("@tonclient/appkit");
TonClient.useBinaryLibrary(libWeb);
const DappServer = "net.ton.dev"
const client = new TonClient({ network: { endpoints: [DappServer] } });

const Radiance = require('../Radiance.json');
import {DEXrootContract} from "../contracts/DEXRoot.js";
import {DEXclientContract} from "../contracts/DEXClient.js";
import {TONTokenWalletContract} from "../contracts/TONTokenWallet.js";
import {RootTokenContract} from "../contracts/RootTokenContract.js";
import {SafeMultisigWallet} from "../msig/SafeMultisigWallet.js";
import {DEXPairContract} from "../contracts/DEXPairContract.js";

import {abiContract} from "@tonclient/core";
// import {getWalletBalance} from "../sdk/run";
import {checkExtensions, getCurrentExtension} from "../extensions/checkExtensions";

const RootContract = new Account(DEXrootContract, {address:Radiance.networks['2'].dexroot, client});


function hex2a(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        let v = parseInt(hex.substr(i, 2), 16);
        if (v) str += String.fromCharCode(v);
    }
    return str;
}
function getShardThis(string) {
    return string[2];
}

export async function getShardConnectPairQUERY(clientAddress,targetShard,rootAddress) {
    let connectorSoArg0;
    let status = false;
    let n = 0;
    let shardC
    let connectorAddr

    const accClient = new Account(DEXclientContract, {address: clientAddress, client});
    const RootTknContract = new Account(RootTokenContract, {address:rootAddress, client});

    let shardW
    let walletAddr
    while (!status) {
        let response = await accClient.runLocal("getConnectorAddress", {_answer_id: 0, connectorSoArg: n})
        connectorAddr = response.decoded.output.value0;
        // console.log("connectorAddr",connectorAddr)
        shardC = getShardThis(connectorAddr);
        console.log("shardC", shardC, targetShard)
        if (shardC === targetShard) {

            console.log("getConnectorAddress:", connectorAddr);
            let resp = await RootTknContract.runLocal("getWalletAddress", {_answer_id: 0, wallet_public_key_: 0, owner_address_: connectorAddr})
            walletAddr = resp.decoded.output.value0;
            shardW = getShardThis(walletAddr);
            console.log("shardW",shardW,targetShard)
            if (shardW === targetShard) {
                console.log("Bingo!");
                connectorSoArg0 = n;
                console.log("getWalletAddress:", walletAddr);

                status = true;
            } else {console.log(n);}
        } else {console.log(n);}
        n++;
    }
    console.log("connectorSoArg0",connectorSoArg0,"shardC",shardC,"shardW",shardW,"targetShard",targetShard,"connectorAddr",connectorAddr,"walletAddr",walletAddr)
    return connectorSoArg0
}


export async function getRootCreators() {
    try {

        let RootCreators = await RootContract.runLocal("creators", {}).catch(e=>console.log(e))
        console.log("curWalletBalance",RootCreators.decoded.output.creators)
        return RootCreators.decoded.output
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}
export async function getRootBalanceOF() {
    try {

        let RootbalanceOf = await RootContract.runLocal("balanceOf", {})
        console.log("balanceOf",RootbalanceOf.decoded.output.balanceOf)
        return RootbalanceOf.decoded.output
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to get balance of TOKENS in token wallets
 * @author   max_akkerman
 * @param   {string} walletAddress
 * @return   {number}
 */

export async function getWalletBalanceQUERY(walletAddress) {
    try {
        const curWalletContract = new Account(TONTokenWalletContract, {address:walletAddress, client});

        let curWalletBalance = await curWalletContract.runLocal("balance", {_answer_id:0})
        console.log("curWalletBalance",curWalletBalance.decoded.output.value0)
        return curWalletBalance
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to check connected pair or not
 * @author   max_akkerman
 * @param   {string, string} clientAddress,pairAddress
 * @return   {bool}
 */

export async function checkClientPairExists(clientAddress,pairAddress) {
    const acc = new Account(DEXclientContract, {address: clientAddress, client});
    try{
        const response = await acc.runLocal("getAllDataPreparation", {});
        let clientPairs = response.decoded.output.pairKeysR

        let newArr = clientPairs.filter(item => item === pairAddress
        );
        return newArr.length !== 0;
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to get client wallets
 * @author   max_akkerman
 * @param   {string} clientAddress
 * @return   [{walletAddress:string,symbol:string,balance:number}]
 */


export async function getAllClientWallets(clientAddress) {
    const acc = new Account(DEXclientContract, {address: clientAddress, client});
    const response = await acc.runLocal("rootWallet", {});

    let normalizeWallets = []
    try {
        for (const item of Object.entries(response.decoded.output.rootWallet)) {

            const curWalletContract = new Account(TONTokenWalletContract, {address: item[1], client});
            const curRootContract = new Account(RootTokenContract, {address: item[0], client});

            let curWalletData = await curWalletContract.runLocal("getDetails", {_answer_id: 0})
            let curRootData = await curRootContract.runLocal("getDetails", {_answer_id: 0})
            let itemData = {};

            itemData.walletAddress = item[1];
            itemData.symbol = hex2a(curRootData.decoded.output.value0.symbol);
            itemData.balance = +curWalletData.decoded.output.value0.balance / 1000000000;

            normalizeWallets.push(itemData)
        }
        console.log(normalizeWallets);
        return normalizeWallets
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to check existing of dexclient at root
 * @author   max_akkerman
 * @param   {number} clientPubkey
 * @return   [{walletAddress:string,symbol:string,balance:number}]
 */

export async function checkPubKey(clientPubkey) {
    try {
        let response = await RootContract.runLocal("checkPubKey", {pubkey:"0x"+clientPubkey})
        let checkedData = response.decoded.output;
        return checkedData
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to get all pairs on dex root
 * @author   max_akkerman
 * @param
 * @return   [{pairAddress:string,symbolA:string,reserveA:number,symbolB:string,reserveB:number,rateAB:nubmer,rateBA:number}]
 */

export async function getAllPairsWoithoutProvider() {
    const acc = new Account(DEXrootContract, {address: "0:74a70fecf38874f6b6e131df9aa1099d8ed3046312f233cb36aba5f6fb2513ff", client});
    const response = await acc.runLocal("pairs", {});

    let normlizeWallets = []

    for (const item of Object.entries(response.decoded.output.pairs)) {

        const curRootTokenA = new Account(RootTokenContract, {address: item[1].root0, client});
        const curRootTokenB = new Account(RootTokenContract, {address: item[1].root1, client});
        const curRootTokenAB = new Account(RootTokenContract, {address: item[1].rootLP, client});
        const pairContract = new Account(DEXPairContract, {address: item[0], client});

        let bal = await pairContract.runLocal("balanceReserve", {})

        let curRootDataA = await curRootTokenA.runLocal("getDetails", {_answer_id:0})
        let curRootDataB = await curRootTokenB.runLocal("getDetails", {_answer_id:0})
        let curRootDataAB = await curRootTokenAB.runLocal("getDetails", {_answer_id:0})

        let itemData = {};
        itemData.pairAddress = item[0];

        // itemData.pairname = hex2a(curRootDataAB.decoded.output.value0.name)
        itemData.symbolA = hex2a(curRootDataA.decoded.output.value0.symbol) === 'WTON' ? 'TON' : hex2a(curRootDataA.decoded.output.value0.symbol)
        itemData.reserveA = bal.decoded.output.balanceReserve[item[1].root0]

        itemData.symbolB = hex2a(curRootDataB.decoded.output.value0.symbol) === 'WTON' ? 'TON' : hex2a(curRootDataB.decoded.output.value0.symbol)
        itemData.reservetB = bal.decoded.output.balanceReserve[item[1].root1]

        itemData.rateAB = +bal.decoded.output.balanceReserve[item[1].root1] / +bal.decoded.output.balanceReserve[item[1].root0]
        itemData.rateBA = +bal.decoded.output.balanceReserve[item[1].root0] / +bal.decoded.output.balanceReserve[item[1].root1]
        normlizeWallets.push(itemData)
    }
    // console.log("{normlizeWallets}",normlizeWallets)
    return normlizeWallets

}

/**
 * Function to get native balance of address in tons
 * @author   max_akkerman
 * @param {string} clientAddress
 * @return   {number}
 */

export async function getClientBalance(clientAddress) {

    let address = clientAddress
    try {
        let clientBalance = await client.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    eq: address,
                },
            },
            result: "balance",
        });

        console.log("clientBalance",+clientBalance.result[0].balance)
        return +clientBalance.result[0].balance / 1000000000
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

const decode = {
    async message(abi, boc) {
        try {
            const decodedMessage = (
                await TonClient.default.abi.decode_message({
                    abi: abiContract(abi),
                    message: boc,
                })
            )
            return decodedMessage
        } catch (e) {
            // console.log(e)
            return e.code
        }
    },
}

async function body(abi, body, internal = true) {
    try {
        const decodedBody = (
            await TonClient.default.abi.decode_message_body({
                abi: abiContract(abi),
                body: body,
                is_internal: internal
            })
        )
        return decodedBody
    } catch (e) {
        console.log(e)
        return e.code
    }
}
//abiContract(abi),
async function _body(abi, body, internal = true) {
    try {
        const decodedBody = 
            await client.abi.decode_message_body({
                abi: abi,  
                body: body,
                is_internal: internal
            })
        
        // console.log('decodedBody:' + decodedBody + '; abi:' + abi + '; body:' + body);
        return decodedBody
    } catch (e) {
        console.log('abi:' + abi + '; body:' + body + ';' + e)
        return e.code
    }
}


export async function subscribe(address) {

    let subscribeID = (await client.net.subscribe_collection({
        collection: "messages",
        filter: {
            dst: { eq: address },
        },
        limit:1,
        // order:[{path:"created_at",direction:DESC}],
        order:[{path:"created_at",direction:'DESC'}],
        result: "id boc created_at body",
    }, async (params,responseType) => {
        if (responseType === ResponseType.Custom) {
            // let decoded = await decode.message(DEXrootContract.abi, params.result.boc)
            // if (decoded === 304) {decoded = await decode.message(RootTokenContract.abi, params.result.boc)}
            // if (decoded === 304) {decoded = await decode.message(TONTokenWalletContract.abi, params.result.boc)}
            // if (decoded === 304) {decoded = await decode.message(SafeMultisigWallet.abi, params.result.boc)}
            // if (decoded === 304) {decoded = await decode.message(DEXPairContract.abi, params.result.boc)}
            // if (decoded === 304) {decoded = await decode.message(DEXclientContract.abi, params.result.boc)}

// console.log("params.result.id", params.result.id)
// console.log("created_at_string", params.result.created_at)
//             let resInput = decoded.value

            let resBody = await body(DEXclientContract.abi, params.result.body)
            if (resBody === 304) {resBody = await body(DEXrootContract.abi, params.result.body)}
            if (resBody === 304) {resBody = await body(DEXPairContract.abi, params.result.body)}
            if (resBody === 304) {resBody = await body(SafeMultisigWallet.abi, params.result.body)}
            if (resBody === 304) {resBody = await body(RootTokenContract.abi, params.result.body)}
            if (resBody === 304) {resBody = await body(TONTokenWalletContract.abi, params.result.body)}

            console.log("resBody",resBody);

            let payload = await _body(TONTokenWalletContract.abi,resBody.value.payload)
            if (payload === 304) {payload = await _body(DEXclientContract.abi, resBody.value.payload)}
            if (payload === 304) {payload = await _body(DEXPairContract.abi, resBody.value.payload)}
            if (payload === 304) {payload = await _body(SafeMultisigWallet.abi, resBody.value.payload)}
            if (payload === 304) {payload = await _body(RootTokenContract.abi, resBody.value.payload)}
            if (payload === 304) {payload = await _body(DEXrootContract.abi, resBody.value.payload)}
            console.log("payload",payload);


            // let caseID = await checkMessagesAmount({transactionID:params.result.id, "created_at":params.result.created_at, amountOfTokens: resInput.tokens, grams:resInput.grams,})
      //TODO get webhook data here
      //       console.log("params.result.body",typeof params.result.body, params.result.body)
            // await chek(caseID)
        }
    })).handle;
    // await _db.saveSubscribeID({"subID":subscribeID,"address":address})
    console.log({"subID":subscribeID,"address":address})
    // return {"status":"success", "subscribed address": address}
}
let checkerArr = [];
let checkMessagesAmount = function(messageID){
    // checkerArr.push(messageID)

    for (let i = 0; i < checkerArr.length; i++) {
        if (checkerArr[i].transactionID === messageID.transactionID) {
            // checkerArr.push(messageID)
            return null
        }
        // else {console.log("message:",messageID)}
        // return null
    }
    checkerArr.push(messageID)
    // if(checkerArr.length === 2){
    // checkerArr.filter(function(item, pos) {
    //         return checkerArr.indexOf(item) === pos;
    //     })
    //     // checkerArr.map(item=> {
    //     //     return item.grams === 0
    // })
    //     // if(checkerArr[0] === checkerArr[1]){
    //     //     checkerArr = [];
    //     //     console.log("checkerArr[0]",checkerArr[0])
    //     //     return checkerArr[0]
    //     // }
    // }
    // console.log("checkerArr",checkerArr)
    console.log("message:",messageID)
    return null
}
