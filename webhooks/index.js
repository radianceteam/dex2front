let subscribe = async function(address) {
    let subscribeID = (await client.net.subscribe_collection({
                collection: "messages",
                filter: {
                    dst: { eq: address }
                    },
                result: "id",

            }, async (d,responseType) => {
                if (responseType === ResponseType.Custom) {
                    console.log(">>> Account subscription triggered ", d.result.id);
                    let caseID = checkMessagesAmount(d.result.id)
                    if(caseID){
                        checkerArr = [];
                        await getCurMsgData(caseID)
                    }
                }
            })).handle;
        // await _db.saveSubscribeID({"subID":subscribeID,"address":address})
        return {"status":"success", "subscribed address": address}
};

let checkerArr = [];
let checkMessagesAmount = function(messageID){
    checkerArr.push(messageID)
    if(checkerArr.length === 2){
        if(checkerArr[0] === checkerArr[1]){
            return checkerArr[0]
        }
    }
    return false
}

let getCurMsgData = async function(id) {
    const batchQueryResult1 = (await client.net.batch_query({
        "operations": [
            {
                type: 'QueryCollection',
                collection: 'messages',
                filter: {
                    id: {
                        eq: id
                    }
                },
                result: 'src'
            }, {
                type: 'QueryCollection',
                collection: 'messages',
                filter: {
                    id: {
                        eq: id
                    }
                },
                result: 'value'
            },
            {
                type: 'QueryCollection',
                collection: 'messages',
                filter: {
                    id: {
                        eq: id
                    }
                },
                result: 'dst'
            },
            {
                type: 'QueryCollection',
                collection: 'messages',
                filter: {
                    id: {
                        eq: id
                    }
                },
                result: 'created_at'
            },
        ]
    })).results;
    let value = parseInt(batchQueryResult1[1][0].value, 16)
    let transData = {"src": batchQueryResult1[0][0].src, "dst":batchQueryResult1[2][0].dst, "value":value, "createdAt":batchQueryResult1[3][0].created_at}
    // let result = await _db.updateTransactions(transData)
}


let unsubscribe = async function(address) {

    // let userData = await _db.unsubAtdb(address)

    await client.net.unsubscribe({ handle: userData.subscribeID });
    return {"status":"success", "subscribed address": address}
};




(async () => {
    try {
        // const { address, signer } = await deployNew("Hello World!");
        // console.log(`Initial hello text is "${await getHelloText(address)}"`);

        // const accountSubscription = await TonClient.default.net.subscribe_collection({
        //     collection: "accounts",
        //     filter: { id: { eq: address } },
        //     result: "balance",
        // }, (params, responseType) => {
        //     if (responseType === ResponseType.Custom) {
        //         console.log("Account has updated. Current balance is ", parseInt(params.result.balance));
        //     }
        // });

        // const messageSubscription = await TonClient.default.net.subscribe_collection({
        //     collection: "messages",
        //     filter: {
        //         src: { eq: address },
        //         OR: {
        //             dst: { eq: address },
        //         }
        //     },
        //     result: "boc",
        // }, async (params, responseType) => {
        //     try {
        //         if (responseType === ResponseType.Custom) {
        //             const decoded = (await TonClient.default.abi.decode_message({
        //                 abi: abiContract(HelloEventsContract.abi),
        //                 message: params.result.boc,
        //             }));
        //             switch (decoded.body_type) {
        //             case MessageBodyType.Input:
        //                 console.log(`External inbound message, function "${decoded.name}", parameters: `, JSON.stringify(decoded.value));
        //                 break;
        //             case MessageBodyType.Output:
        //                 console.log(`External outbound message, function "${decoded.name}", result`, JSON.stringify(decoded.value));
        //                 break;
        //             case MessageBodyType.Event:
        //                 console.log(`External outbound message, event "${decoded.name}", parameters`, JSON.stringify(decoded.value));
        //                 break;
        //             }
        //         }
        //     } catch (err) {
        //         console.log('>>>', err);
        //     }
        // });

        // await setHelloText(address, signer, "Hello there!");
        // console.log(`Updated hello text is ${await getHelloText(address)}`);

        // /** Free up all internal resources associated with wallets. */
        // await TonClient.default.net.unsubscribe(accountSubscription);
        // await TonClient.default.net.unsubscribe(messageSubscription);

        



    } catch (error) {
        console.error(error);
    }
    TonClient.default.close();
})();