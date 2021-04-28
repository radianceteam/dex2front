import freeton from "freeton";
import { TonClient } from "@tonclient/core";
import { libWeb } from "@tonclient/lib-web";
import { Account } from "@tonclient/appkit";

TonClient.useBinaryLibrary(libWeb);

const hex2ascii = require('hex2ascii');
const Radiance = require('../contracts/Radiance.json');
const { DEXrootContract } = require('../contracts/DEXroot.js');
const { DEXpairContract } = require('../contracts/DEXpair.js');
const { DEXclientContract } = require('../contracts/DEXclient.js');
const { RootTokenContract } = require('../contracts/RootToken.js');
const { TONTokenWalletContract } = require('../contracts/TONTokenWallet.js');
const Kington = require('../contracts/Kington.json');
const KingtonOrder = require('../contracts/KingtonOrder.json');
const SetcodeMultisigWallet = require('../contracts/SetcodeMultisigWallet.json');


// const _ = {
//     checkExtensionAvailability() {
//         if (window.freeton === undefined) {
//             throw 'Extension not available.';
//         }
//     },
//     getProvider() {
//         return new freeton.providers.ExtensionProvider(window.freeton);
//     }
// };
// window.app = {
//     test () {
//         console.log(_.checkExtensionAvailability())
//     }
//
// }
console.log(freeton)
