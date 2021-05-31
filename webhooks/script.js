const { Account } = require("@tonclient/appkit");
const {
    signerKeys,
    TonClient,
		MessageBodyType
} = require("@tonclient/core");
const { abiContract } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const { ResponseType } = require("@tonclient/core/dist/bin");

TonClient.useBinaryLibrary(libNode);
TonClient.defaultConfig = { network: { endpoints: ["http://net.ton.dev"] } };

const { DEXrootContract } = require('../contracts/DEXroot.js');
const { DEXpairContract } = require('../contracts/DEXpair.js');
const { DEXclientContract } = require('../contracts/DEXclient.js');
const { SafeMultisigContract } = require('../contracts/SafeMultisigContract.js');
const { SafeMultisigWalletContract } = require('../contracts/SafeMultisigWalletContract.js');
const { _SetcodeMultisigWallet } = require('../contracts/SetcodeMultisigWallet.js');
const { _SetcodeMultisigWallet2 } = require('../contracts/SetcodeMultisigWallet2.js');
const { RootTokenContract } = require('../contracts/RootToken.js');
const { TONTokenWalletContract } = require('../contracts/TONTokenWallet.js');

// const MultisigContract = loadContract("SafeMultisigWalletContract");

const address = process.argv[2] || "0:d6709a4e915ef4356fd4e8d451e39cf7a973d5dfea05d533b71a96e10d4f7111";//process.argv[2] || 
(async () => {
    // const client = new TonClient({ network: { endpoints: ["net.ton.dev"] } }); // net.ton.dev  http://localhost
		// const client = new TonClient({network: { server_address: 'net.ton.dev' }}) 

  const decode = { 
    async message(abi, boc) {        
      try {
        const decodedMessage = (              
          await TonClient.default.abi.decode_message({
            abi: abiContract(abi),  //DEXclientContract.abi RootTokenContract 60ae82cc933c9613a7a9e531129a66195390edd61d8f5b77224893cea003021e
            message: boc,
          })
        )
        return decodedMessage
      } catch (e) {
        // console.log(e)
        return e.code
      }                      
    },      

    // 0 – internal
    // 1 – extIn
    // 2 – extOut
    async body(abi, body, internal = true) {
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
    },
  } 


  try {
      const subscriptionMessagesHandle = (await TonClient.default.net.subscribe_collection({ // client.net.subscribe_collection({

              collection: "messages",
                filter: {
                  src: {
                    eq: address,
                    // "0:d6709a4e915ef4356fd4e8d451e39cf7a973d5dfea05d533b71a96e10d4f7111",
                    // "0:d720aac92bf53530d4d5b1c5fdfec0f973c931f00dbca0abde4209def74a3339" ,
                  }, 
                    OR:{
                      dst:{
                        eq: address,
                        // "0:d6709a4e915ef4356fd4e8d451e39cf7a973d5dfea05d533b71a96e10d4f7111",
                        // "0:d720aac92bf53530d4d5b1c5fdfec0f973c931f00dbca0abde4209def74a3339" 
                      }
                  },
                }, 
                limit:1,
                // orderBy:[{path:"created_at",direction:DESC}]    
                // limit:10,
                order:[{path:"created_at",direction:'DESC'}],
                result: "id boc body created_at_string", //id src dst created_at_string msg_type msg_type_name value boc body
      }, async (params, responseType) => {
        try {
          if (responseType === ResponseType.Custom && params.result.body) {
            // const decoded = (await TonClient.default.abi.decode_message({
            //     abi: abiContract(TONTokenWalletContract.abi),  //TONTokenWalletContract
            //     // abi: abiContract(DEXclientContract.abi),
            //     message: params.result.boc,
            // }));


            let resMessage = await decode.message(DEXclientContract.abi, params.result.boc) 
            if (resMessage == 304) {resMessage = await decode.message(DEXrootContract.abi, params.result.boc)} 
            if (resMessage == 304) {resMessage = await decode.message(DEXpairContract.abi, params.result.boc)} 
            if (resMessage == 304) {resMessage = await decode.message(RootTokenContract.abi, params.result.boc)} 
            if (resMessage == 304) {resMessage = await decode.message(TONTokenWalletContract.abi, params.result.boc)} 
            if (resMessage == 304) {resMessage = await decode.message(SafeMultisigContract.abi, params.result.boc)}  
            if (resMessage == 304) {resMessage = await decode.message(SafeMultisigWalletContract.abi, params.result.boc)}
            if (resMessage == 304) {resMessage = await decode.message(_SetcodeMultisigWallet.abi, params.result.boc)}
            if (resMessage == 304) {resMessage = await decode.message(_SetcodeMultisigWallet2.abi, params.result.boc)}

            console.log(`Type inbound message "${resMessage.body_type}", date: "${params.result.created_at_string}" function "${resMessage.name}", parameters: `, JSON.stringify(resMessage.value));
   
              // switch (decoded.body_type) {
              // case MessageBodyType.Input:
              //     console.log(`External inbound message, date: "${params.result.created_at_string}", function "${decoded.name}", parameters: `, JSON.stringify(decoded.value));
              //     break;
              // case MessageBodyType.Output:
              //     console.log(`External outbound message, function "${decoded.name}", result`, JSON.stringify(decoded.value));
              //     break;
              // case MessageBodyType.Event:
              //     console.log(`External outbound message, event "${decoded.name}", parameters`, JSON.stringify(decoded.value));
              //     break;
              // }
          }
        } catch (err) {
            console.log('>>>', err);
        }
      
      
      
      }))       

      // console.log(`\Sending money from ${await wallet1.getAddress()} to ${await wallet2.getAddress()} and waiting for completion events.`);

    } catch (error) {
      console.error(error);
  }
        // await sendMoney(wallet1, await wallet2.getAddress(), 5_000_000_000);

        await new Promise(resolve => setTimeout(resolve, 10_000));

        // Cancels a subscription specified by its handle. https://github.com/tonlabs/TON-SDK/blob/master/docs/mod_net.md#unsubscribe
        // await client.net.unsubscribe({ handle: subscriptionAccountHandle });
        // await client.net.unsubscribe({ handle: subscriptionTransactionHandle });
        //    await client.net.unsubscribe({ handle: subscriptionMessageHandle });


        // https://github.com/tonlabs/TON-SDK/blob/master/docs/mod_net.md#find_last_shard_block
        // Returns ID of the latest block in a wallet 1 address account shard.
        // const block_id1 = (await client.net.find_last_shard_block({
        //     address: await wallet1.getAddress(),
        // })).block_id;
        // console.log(`Last Shard Block id ${block_id1} in shard of ${await wallet1.getAddress()}`);

        // // Returns ID of the latest block in a wallet 2 address account shard.
        // const block_id2 = (await client.net.find_last_shard_block({
        //     address: await wallet2.getAddress(),
        // })).block_id;
        // console.log(`Last Shard Block id ${block_id2} in shard of ${await wallet2.getAddress()}`);


        // await new Promise(resolve => setTimeout(resolve, 60_000));
        // wallet1.refresh();
        // wallet2.refresh();

        // console.log(`Account 1 balance is ${(await wallet1.getAccount()).balance}`);

        // console.log(`Account 2 balance is ${(await wallet2.getAccount()).balance}`);
        // await wallet1.free();
        // await wallet2.free();
        // TonClient.close();

})();