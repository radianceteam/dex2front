// import freeton from "../freeton_dev/src/index";
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
const Kington = require('../contracts/Kington.json');
const KingtonOrder = require('../contracts/KingtonOrder.json');
const SetcodeMultisigWallet = require('../contracts/SetcodeMultisigWallet.json');


const _ = {
  checkExtensionAvailability() {
    if (window.freeton === undefined) {
      throw 'Extension not available.';
    }
  },
  getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
  }
};

window.app = {
  async requestVersion() {
    const button = document.getElementById('buttonRequestVersion');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const version = await provider.getVersion();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(version)
      console.log(version);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async requestNetwork() {
    const button = document.getElementById('buttonRequestNetwork');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const network = await provider.getNetwork();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(network)
      console.log(network);
    } finally {
      button.disabled = false;
    }
  },
  async requestKeys() {
    const button = document.getElementById('buttonRequestKeys');
    button.disabled = true;
    try {
      const client = new TonClient({network: { server_address: 'net.ton.dev' }});
      const keys = await client.crypto.generate_random_sign_keys();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(keys)
      console.log(keys);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async getWallet() {
    const button = document.getElementById('buttonGetWallet');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      // const wallet = await signer.getWallet();
      document.getElementById('result').innerHTML += '</br>' + 'wallet: '+ JSON.stringify(signer.wallet.address);
      console.log('wallet: '+signer.wallet.address);
      const client = new TonClient({network: { server_address: 'net.ton.dev' }});
      const result = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: signer.wallet.address,},},result: "balance",})).result;
      document.getElementById('result').innerHTML += '</br>' + 'balance: '+ JSON.stringify(parseInt(result[0].balance));
      console.log('balance: '+parseInt(result[0].balance));
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async getPubKey() {
    const button = document.getElementById('buttonGetPublicKey');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      document.getElementById('result').innerHTML += '</br>' + 'public key: '+ JSON.stringify(pubkey)
      console.log('public key: '+pubkey);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async runContractMethod() {
    const button = document.getElementById('buttonRunContractMethod');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const contract = new freeton.Contract(provider, Kington.abi, Kington.networks['2'].address);
      const messages = await contract.methods.getMessages.run();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(messages);
      console.log(messages);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async runContractR1Method() {
    const button = document.getElementById('buttonCallContractR1Method');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      let pairsArr = await contract.methods.pairKeys.run();
      pairsArr = pairsArr.pairKeys;
      for (const item of pairsArr) {
        const dexpair = new freeton.Contract(provider, DEXpairContract.abi, item);
        let pairData = await dexpair.methods.getPair.run();
        let rootA = pairData.addressRootA;
        let rootB = pairData.addressRootB;
        let reserveA = pairData.balanceReserveA;
        let reserveB = pairData.balanceReserveB;
        const rootTokenA = new freeton.Contract(provider, RootTokenContract.abi, rootA);
        const rootTokenB = new freeton.Contract(provider, RootTokenContract.abi, rootB);
        let symbolA = await rootTokenA.methods.getSymbol.run();
        let symbolB = await rootTokenB.methods.getSymbol.run();
        symbolA = hex2ascii(symbolA.value0);
        symbolB = hex2ascii(symbolB.value0);
        console.log('Pair:'+symbolA+' : '+symbolB);
        document.getElementById('result').innerHTML += '</br>' +'Pair: '+JSON.stringify(symbolA)+' : '+JSON.stringify(symbolB);
        console.log("reserveA:", reserveA);
        document.getElementById('result').innerHTML += '</br>' + 'reserveA: '+JSON.stringify(reserveA);
        console.log("reserveB:", reserveB);
        document.getElementById('result').innerHTML += '</br>' + 'reserveB: '+JSON.stringify(reserveB);
        let rateBA = Number(reserveA)/Number(reserveB);
        let rateAB = Number(reserveB)/Number(reserveA);
        console.log('1 '+symbolA+' = '+rateAB+' '+symbolB);
        document.getElementById('result').innerHTML += '</br>' + 'rateAB: '+'1 '+JSON.stringify(symbolA)+' = '+JSON.stringify(rateAB)+' '+JSON.stringify(symbolB);
        console.log('1 '+symbolB+' = '+rateBA+' '+symbolA);
        document.getElementById('result').innerHTML += '</br>' + 'rateBA: '+'1 '+JSON.stringify(symbolB)+' = '+JSON.stringify(rateBA)+' '+JSON.stringify(symbolA);

      }
      // document.getElementById('result').innerHTML += '</br>' + JSON.stringify(pairs);
      // console.log(messages);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async runContractR2Method() {
    const button = document.getElementById('buttonCallContractR2Method');
    button.disabled = true;
    try {
      const client = new TonClient({network: { server_address: 'net.ton.dev' }});
      const rootAddress = Radiance.networks['2'].dexroot;
      const rootAcc = new Account( DEXrootContract, {address:rootAddress,client,});
      const response = await rootAcc.runLocal("pairKeys", {});
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(response.decoded.output.pairKeys)
      console.log(response.decoded.output.pairKeys);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async deploy() {
    const button = document.getElementById('buttonDeploy');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const contractBuilder = new freeton.ContractBuilder(signer, KingtonOrder.abi, KingtonOrder.imageBase64);
      contractBuilder.setInitialAmount('1000022000');
      const constructorParams = {
        destinationAddress: Kington.networks['2'].address,
        message: freeton.utils.stringToHex('London is the capital of Great Britain.'),
      };
      const contract = await contractBuilder.deploy(constructorParams);
      await contract.getDeployProcessing().wait();
      console.log(`Deployed. TxId: ${contract.getDeployProcessing().txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async transfer(form) {//Transfer tokens with message "Hello".
    const button = document.getElementById('buttonTransfer');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const payload = 'te6ccgEBAgEADgABCAAAAAABAApIZWxsbw==';
      const contractMessageProcessing = await wallet.transfer(form.address.value, form.amount.value, false, payload);
      await contractMessageProcessing.wait();
      console.log(`Transferred. TxId: ${contractMessageProcessing.txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async confirmTransaction(form) {
    const button = document.getElementById('buttonConfirmTransaction');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = new freeton.Wallet(signer, form.address.value);
      const contractMessageProcessing = await wallet.confirmTransaction(form.txid.value);
      await contractMessageProcessing.wait();
      console.log(`Confirmed. TxId: ${contractMessageProcessing.txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async callContractMethod() {
    const button = document.getElementById('buttonCallContractMethod');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const contract = new freeton.Contract(signer, SetcodeMultisigWallet.abi, '0:bc6ed51718ca3fe6ba96d84e8a0f2f409423b6e3f3198d08634cd7f74372ed48');
      const input = {
        dest: '0:11684118bc3062a07126191bf17a650dbb101aff809eb79a9c64b061f4b9b97b',
        value: '500000000',
        bounce: false,
        allBalance: false,
        payload: '',
      };
      const contractMessageProcessing = await contract.methods.submitTransaction.call(input);
      await contractMessageProcessing.wait();
      console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
      document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async getTokenList() {
    const button = document.getElementById('buttonGetTokenList');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const tokenList = await wallet.getTokenList();
      console.log(tokenList);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async transferToken(form) {
    const button = document.getElementById('buttonTransferToken');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const tokenList = await wallet.getTokenList();
      let token = null;
      for (const item of tokenList) {
        if (item.rootAddress === form.rootAddress.value) {
          token = item;
        }
      }
      if (null === token) {
        throw 'Token with this rootAddress not found in extension.';
      }
      const contractMessageProcessing = await token.transfer(form.address.value, form.amount.value);
      await contractMessageProcessing.wait();
      console.log(`Transferred. TxId: ${contractMessageProcessing.txid}`)
      document.getElementById('result').innerHTML += '</br>' + `Transferred. TxId: ${contractMessageProcessing.txid}`
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
};
