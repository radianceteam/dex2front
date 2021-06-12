import {TonClient} from "@tonclient/core";
import {libWeb} from "@tonclient/lib-web";
import {Account} from "@tonclient/appkit";
import {checkExtensions, getCurrentExtension} from "../extensions/checkExtensions";
import {DEXrootContract} from "../contracts/DEXRoot.js";
import {DEXclientContract} from "../contracts/DEXClient.js";
import {RootTokenContract} from "../contracts/RootTokenContract.js";
import {SafeMultisigWallet} from "../msig/SafeMultisigWallet.js";
import {getRootCreators, getShardConnectPairQUERY, checkPubKey,getClientBalance} from "../webhook/script"

TonClient.useBinaryLibrary(libWeb);

const Radiance = require('../Radiance.json');

function UserException(message) {
    this.message = message;
    this.name = "UserExeption";
}

function getShard(string) {
    return string[2];
}

/**
 * Function to transfer tons
 * @author   max_akkerman
 * @param   {SendTransfer:function, addressTo:string, amount:number}
 * @return   {object} processSwapA
 */

export async function transfer(SendTransfer,addressTo,amount) {
    try {
        const transfer = await SendTransfer(addressTo,amount)
        return transfer
    } catch(e) {
        console.log("e",e)
        return e
    }
}

// /**
//  * Function to transfer tons by building contract
//  * @author   max_akkerman
//  * @param   {SendTransfer:function, addressTo:string, amount:number}
//  * @return   {object} processSwapA
//  */
//
// export async function transferContract() {
//     // let curExt = {};
//     // await checkExtensions().then(async res => curExt = await getCurrentExtension(res))
//     const {pubkey, contract, callMethod,SendTransfer} = curExt._extLib
//     let getClientAddressFromRoot = await checkPubKey(pubkey)
//     if(getClientAddressFromRoot.status === false){
//         return getClientAddressFromRoot
//     }
//
//     try {
//         const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
//         const processSwapA = await callMethod("processSwapA", {pairAddr:pairAddr, qtyA:qtyA}, clientContract)
//     } catch(e) {
//         console.log("e",e)
//         return e
//     }
// }

/**
 * Function to send to root client pubkey
 * @author   max_akkerman
 * @return   callback         onSharding()
 */
export async function setCreator(curExt) {
    const {name, address, pubkey, contract, runMethod, callMethod, internal} = curExt._extLib

    // let checkClientExists = await checkPubKey(pubkey)

    // if(checkClientExists.status){
    //     console.log(UserException("y already have dex client"))
    //     return new UserException("y already have dex client")
    // }else {
        try {

            const rootContract = await contract(DEXrootContract.abi, Radiance.networks['2'].dexroot);
            let deployresp = await callMethod("setCreator", {giverAddr: address}, rootContract)
            let checkClientExists = await getRootCreators().catch(e=>console.log(e))
            let n = 0
            while (!checkClientExists.creators["0x"+pubkey]){
                checkClientExists = await getRootCreators()
                n++
                if(n>100){

                    return new UserException("yps, something goes wrong, try again")
                }
            }
            await onSharding(curExt)


            // return resp

        } catch (e) {
            console.log("catch E", e);
            return e
        }
    // }
}
/**
 * Function to get shard id to deploy dex client
 * @author   max_akkerman
 * @return   callback         createDEXclient()
 */

export async function onSharding(curExt) {
    const {name, address, pubkey, contract, runMethod, callMethod} = curExt._extLib
    try {
        const rootContract = await contract(DEXrootContract.abi, Radiance.networks['2'].dexroot);
        let targetShard = getShard(Radiance.networks['2'].dexroot);
        // console.log("pubkeypubkey",pubkey)
        let status = false;
        let n = 0;
        let clientAddress
        while (!status) {
            let response = await runMethod("getClientAddress", {_answer_id:0,clientPubKey:'0x'+pubkey,clientSoArg:n}, rootContract)
            // console.log("response",response)
            let clientAddr;
            if(name==="broxus"){
                clientAddr = response.value0._address;
            }else{
                clientAddr = response.value0;
            }
            let shard = getShard(clientAddr);
            console.log(shard,targetShard)
            if (shard === targetShard) {
                status = true;
                clientAddress = clientAddr;
                // console.log({address: clientAddr, keys: pubkey, clientSoArg: n})
                await createDEXclient(curExt, {address: clientAddr, keys: '0x'+pubkey, clientSoArg: n}).catch(e=>console.log(e))
                // return {address: clientAddr, keys: pubkey, clientSoArg: n}
            } else {console.log(n);}
            n++;
        }
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

/**
 * Function to send to root client pubkey
 * @author   max_akkerman
 * @param   {object} shardData {address: clientAddr, keys: '0x'+pubkey, clientSoArg: n}
 * @return   {object} {deployedAddress:address,statusCreate:bool}
 */

export async function createDEXclient(curExt, shardData) {
    const {name, address, pubkey, contract, runMethod, callMethod, internal} = curExt._extLib

    try {
        const rootContract = await contract(DEXrootContract.abi, Radiance.networks['2'].dexroot);
        return await callMethod("createDEXclient", {
            pubkey: shardData.keys,
            souint: shardData.clientSoArg
        }, rootContract).catch(e => {
            let ecode = '106';
            let found = e.text.match(ecode);
            if(found){
                return new UserException("y are not registered at dex root, pls transfer some funds to dex root address")
            }else{
                return e
            }
            }
        )
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}


/**
 * Function to swap A
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, qtyA:number}
 * @return   {object} processSwapA
 */

export async function swapA(curExt,pairAddr, qtyA) {
    const {pubkey, contract, callMethod,SendTransfer} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    let checkClientBalance = await getClientBalance(getClientAddressFromRoot.dexclient)
    if(500000000 < checkClientBalance){
        await transfer(SendTransfer,getClientAddressFromRoot.dexclient,3000000000)
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const processSwapA = await callMethod("processSwapA", {pairAddr:pairAddr, qtyA:qtyA}, clientContract)
        console.log("processSwapA",processSwapA)
        return processSwapA
    } catch (e) {
        console.log("catch E processSwapA", e);
        return e
    }
}

/**
 * Function to swap B
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, qtyB:number}
 * @return   {object} processSwapB
 */

export async function swapB(curExt,pairAddr, qtyB) {
    const {pubkey, contract, callMethod,SendTransfer} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    let checkClientBalance = await getClientBalance(getClientAddressFromRoot.dexclient)
    if(500000000 < checkClientBalance){
        await transfer(SendTransfer,getClientAddressFromRoot.dexclient,3000000000)
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const processSwapA = await callMethod("processSwapB", {pairAddr:pairAddr, qtyB:qtyB}, clientContract)
        console.log("processSwapA",processSwapA)
        return processSwapA
    } catch (e) {
        console.log("catch E processSwapB", e);
        return e
    }
}

/**
 * Function to return liquid from pair, tokens - are the liquidityProvider tokens type
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, tokens:number}
 * @return   {object} returnLiquidity
 */


export async function returnLiquidity(curExt,pairAddr, tokens) {
    // let curExt = {};
    // await checkExtensions().then(async res => curExt = await getCurrentExtension(res))
    const {name, address, pubkey, contract, SendTransfer, callMethod} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    let checkClientBalance = await getClientBalance(getClientAddressFromRoot.dexclient)
    if(500000000 < checkClientBalance){
        await transfer(SendTransfer,getClientAddressFromRoot.dexclient,3000000000)
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const returnLiquidity = await callMethod("returnLiquidity", {pairAddr:pairAddr, tokens:tokens}, clientContract)
        return returnLiquidity
    } catch (e) {
        console.log("catch E returnLiquidity", e);
        return e
    }
}

/**
 * Function to process liquid
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string, qtyA:number,qtyB:number}
 * @return   {object} processLiquidity
 */

export async function processLiquidity(curExt,pairAddr, qtyA, qtyB) {
    // let curExt = {};
    // await checkExtensions().then(async res => curExt = await getCurrentExtension(res))
    const {name, address, pubkey, contract, SendTransfer, callMethod} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    let checkClientBalance = await getClientBalance(getClientAddressFromRoot.dexclient)
    if(500000000 < checkClientBalance){
        await transfer(SendTransfer,getClientAddressFromRoot.dexclient,3000000000)
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        const processLiquidity = await callMethod("processLiquidity", {pairAddr:pairAddr, qtyA:qtyA, qtyB:qtyB}, clientContract)
        return processLiquidity
    } catch (e) {
        console.log("catch E processLiquidity", e);
        return e
    }
}

/**
 * Function to connect To Pair
 * @author   max_akkerman
 * @param   {curExt:object, pairAddr:string}
 * @return   {object} processLiquidity
 */

export async function connectToPair(curExt,pairAddr) {
    const {contract,callMethod,runMethod,pubkey,SendTransfer} = curExt._extLib
    let getClientAddressFromRoot = await checkPubKey(pubkey)
    if(getClientAddressFromRoot.status === false){
        return getClientAddressFromRoot
    }
    let checkClientBalance = await getClientBalance(getClientAddressFromRoot.dexclient)
    if(500000000 < checkClientBalance){
        await transfer(SendTransfer,getClientAddressFromRoot.dexclient,3000000000)
    }
    try {
        const clientContract = await contract(DEXclientContract.abi, getClientAddressFromRoot.dexclient);
        let connectPairFunc = await callMethod("connectPair", {pairAddr: pairAddr}, clientContract)
        console.log("connectPairFunc",connectPairFunc)
        await getClientForConnect({pairAddr: pairAddr, runMethod:runMethod,callMethod:callMethod,contract:contract,clientAddress:getClientAddressFromRoot.dexclient,clientContract:clientContract})

    } catch (e) {
        console.log("catch E", e);
        return e
    }
}

export async function getClientForConnect(data) {
    const {pairAddr, clientAddress, contract, runMethod, callMethod,clientContract} = data
    try {
        let soUINT = await runMethod("soUINT", {}, clientContract)
        let pairs = await runMethod("pairs", {}, clientContract)
        let clientRoots = await runMethod("getAllDataPreparation", {}, clientContract)
        let curPair = null
        while (!curPair){
            pairs = await runMethod("pairs", {}, clientContract)
            curPair = pairs.pairs[pairAddr]
        }

        await connectToPairStep2DeployWallets({...soUINT, curPair,clientAdr:clientAddress,callMethod,clientContract,contract:contract,clientRoots:clientRoots.rootKeysR})
    } catch (e) {
        console.log("catch E", e);
        return e
    }
}



export async function connectToPairStep2DeployWallets(connectionData) {
    let { curPair,clientAdr,callMethod, clientContract,clientRoots} = connectionData;

    let targetShard = getShard(clientAdr);
    let cureClientRoots = [curPair.rootA,curPair.rootB,curPair.rootAB]
    let newArr = cureClientRoots.filter(function(item) {
        return clientRoots.indexOf(item) === -1;
    });
    if(newArr.length===0){
        return new UserException("y already have all pair wallets")
    }
    try{
        await newArr.map(async (item,i)=>{
        let soUint = await getShardConnectPairQUERY(clientAdr,targetShard,item)
        await callMethod("connectRoot", {root: item, souint:soUint,gramsToConnector:500000000,gramsToRoot:1500000000}, clientContract).then(respt=>{
        })
        })
    }catch (e) {
        console.log("this",e)
        return e
    }

}


