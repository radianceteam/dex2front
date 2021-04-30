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
const { TONwrapper } = require('../contracts/TONwrapper.js');

const { DEXclientContract } = require('../contracts/DEXclient.js');
const { RootTokenContract } = require('../contracts/RootToken.js');
const { TONTokenWalletContract } = require('../contracts/TONTokenWallet.js');
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
  async checkPubKey() {
    const button = document.getElementById('buttonCheckPublicKey');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const result = await contract.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      document.getElementById('result').innerHTML += '</br>' + 'checkPubKey: '+ JSON.stringify(result)
      console.log('checkPubKey: '+result.status);
      console.log('checkPubKey: '+result.dexclient);
      if (result.status == true) {
        const client = new TonClient({network: { server_address: 'net.ton.dev' }});
        const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.dexclient,},},result: "balance",})).result;
        document.getElementById('result').innerHTML += '</br>' + ' balance: '+ JSON.stringify(parseInt(balance[0].balance))
        console.log('balance: '+parseInt(balance[0].balance));
      }

    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async computeDEXclientAddr(form) {
    const button = document.getElementById('buttonComputeDEXclientAddr');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      console.log("pub", pubkey)
      const contract = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const result = await contract.methods.computeDEXclientAddrWithId.run({pubkey:"0x"+pubkey,clientId:form.clientId.value});
      document.getElementById('result').innerHTML += '</br>' + 'computeDEXclientAddrWithId: '+ JSON.stringify(result)
      console.log('computeDEXclientAddrWithId: '+result.value0);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async createDEXclient(form) {
    const button = document.getElementById('buttonCreateDEXclient');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      console.log("from", form)
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const contract = new freeton.Contract(signer, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const contractMessageProcessing = await contract.methods.createDEXclient.call({pubkey:"0x"+pubkey,clientId:form.clientId.value});
      await contractMessageProcessing.wait();
      console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
      document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
      // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
      // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
      document.getElementById('result').innerHTML += '</br>' + 'createDEXclient: '+ JSON.stringify(contractMessageProcessing)
      console.log('createDEXclient: '+contractMessageProcessing);
      // console.log('balance: '+parseInt(balance[0].balance));
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async getClientRoots() {
    const button = document.getElementById('buttonGetClientRoots');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
        const dexclientData = await dexclient.methods.getAllDataPreparation.run();
        
        const dexclientDataAddress = await dexclient.methods.showContractAddress.run();

        document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        for (const item of dexclientData.rootKeysR) {
          const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
          const symbol = await tokenRoot.methods.getSymbol.run();
          const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
          const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
          const balance = await tokenWallet.methods.getBalance.run();
          document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
          console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async getClientPairs() {
    const button = document.getElementById('buttonGetClientPairs');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
        const dexclientData = await dexclient.methods.getAllDataPreparation.run();
        document.getElementById('result').innerHTML += '</br>' + 'getAllClienPairs: '+ JSON.stringify(dexclientData.pairKeysR)
        console.log('getAllClienPairs: '+dexclientData.pairKeysR);
        for (const item of dexclientData.pairKeysR) {
          const dexpair = new freeton.Contract(provider, DEXpairContract.abi, item);
          let pairData = await dexpair.methods.getPair.run();
          let rootA = pairData.addressRootA;
          let rootB = pairData.addressRootB;
          const rootTokenA = new freeton.Contract(provider, RootTokenContract.abi, rootA);
          const rootTokenB = new freeton.Contract(provider, RootTokenContract.abi, rootB);
          let symbolA = await rootTokenA.methods.getSymbol.run();
          let symbolB = await rootTokenB.methods.getSymbol.run();
          symbolA = hex2ascii(symbolA.value0);
          symbolB = hex2ascii(symbolB.value0);
          console.log('Pair:'+symbolA+' : '+symbolB+' addr: '+item);
          console.log('balanceReserve-'+symbolA+' : ' + pairData.balanceReserveA)// + ' addr: '+ pairData.addressReserveA);
          console.log('balanceReserve-'+symbolB+' : ' + pairData.balanceReserveB)// + ' addr: '+ pairData.addressReserveB);
          document.getElementById('result').innerHTML += '</br>' + 'balanceReserve-'+symbolA+' : ' + pairData.balanceReserveA + ' addr: '+ pairData.addressReserveA
          document.getElementById('result').innerHTML += '</br>' + 'balanceReserve-'+symbolB+' : ' + pairData.balanceReserveB + ' addr: '+ pairData.addressReserveB
          document.getElementById('result').innerHTML += '</br>' +'Pair: '+JSON.stringify(symbolA)+' : '+JSON.stringify(symbolB)+' addr: '+JSON.stringify(item);

        }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  async connectDEXpair(form) {
    const button = document.getElementById('buttonConnectDEXpair');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const contract = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
        const contractMessageProcessing = await contract.methods.connectPair.call({pairAddr:form.pairAddr.value});
        await contractMessageProcessing.wait();
        console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
        document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
        // const client = new TonClient({network: { server_address: 'net.ton.dev' }});
        // const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: result.value0,},},result: "balance",})).result;
        document.getElementById('result').innerHTML += '</br>' + 'createDEXclient: '+ JSON.stringify(contractMessageProcessing)
        console.log('createDEXclient: '+contractMessageProcessing);
        // console.log('balance: '+parseInt(balance[0].balance));
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },


  /*
    SWAP
    все гет функции желательно запустить при запуске приложения (то есть получении провайдера -> адреса клиента )
    это получение
        - все пары которые есть на dexroot
        - всех пар к которым подключен клиент и по ним собрать все адреса ( getPair )
        - руты которые есть у клиента
        - по рутам собрать валлеты (балансы, symbol, token name, адреса этих валлетов) - в функции getClientRoots есть пример
    все это необходимо положить в хук или redux и привести в удобный для работы вид

    * все что здесь повторяется можно вынести в utils - проверки типов, создание экземпляров контрактов
    * методы для работы с блокчейном можно вынести в папку _sdkrun для геттеров и _sdkcall для платных функций
   */
  async swapA(form) {
    const button = document.getElementById('swapAForm');
    button.disabled = true;
    try {
      //перед началом в интерфейсе можно вызвать GET dex client root и получить балансы токен валлетов и после проведения свапа проверить еще раз чтобы убедиться что токены после обмена пришли

      //нужно вынести проверку наличия dexclient в отдельную функцию, и вызывать при каждом действии (имеется в виду при работе с блокчейном)

      _.checkExtensionAvailability();
      //чекаем провайдера и вытаскиваем signer
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      // //вытаскиваем из экстеншна pubkey
      const pubkey = await signer.getPublicKey();
      // //создаем образ DEXrootContract прикладывая к методу contract провайдера, абишку
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      // //проверяем есть ли задеплоенный смартконтракт клиента на руте по публичному ключу
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      // //если в rootData.status true и rootData.dexclient есть текущий адрес идем дальше, если нет просим пользователя задеплоить dexclient
      if(!rootData.status){
        console.log("no dex client pls deploy")
        return
      }

      /*
      для свапа первым шагом нужно перевести из msig кошелька на dexclient какое-то количество тоннов
       */
      ////если на msig wallet недостаточно средств выдать ошибку
      let amountToTransfer = +form.nanoTokens.value + 1000000000
      const client = new TonClient({network: { server_address: 'net.ton.dev' }});

      const balanceWallet = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: signer.wallet.address,},},result: "balance",})).result;
      //проверяем достаточно ли денег чтобы отправить,если нет возвращаем ошибку
      if(parseInt(balanceWallet[0].balance) < amountToTransfer){
        console.log("not enought tons",balanceWallet[0].balance,"amountToTransfer",amountToTransfer)
        return
      }

      //перед отправков получаем текущий баланс dexclient, это нужно чтобы после переода tons проверить что деньги реально пришли
      const balanceDEXclientBefore = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: rootData.dexclient,},},result: "balance",})).result;
      //создаем экземплял кошелька
      let x = await new freeton.Wallet(signer,signer.wallet.address)
      //непосредственно перевод
      let res = await x.transfer(rootData.dexclient, amountToTransfer)
      console.log("signer.wallet.address",signer.wallet.address)
      //получаем баланс после перевода и рекурсивно сравниваем балансы
      let balanceDEXclientAfter = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: rootData.dexclient,},},result: "balance",})).result;

      //цикл можно обернуть в settimeout раз в 1сек примерно, через 10 сек return
      while(parseInt(balanceDEXclientBefore[0].balance) === parseInt(balanceDEXclientAfter[0].balance)){
        balanceDEXclientAfter = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: rootData.dexclient,},},result: "balance",})).result;
        console.log("transaction from msig\nbalance before",parseInt(balanceDEXclientBefore[0].balance), "balance after",parseInt(balanceDEXclientAfter[0].balance), "difference", parseInt(balanceDEXclientAfter[0].balance) - parseInt(balanceDEXclientBefore[0].balance))
      }
      console.log("all ok, transfer from msig to dexclient success")

      /*
            вторым шагом необходимо обернуть нативную валюту TON в токен WTON
      */
      const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);
      //здесь мы вызываем у контракта клиента функцию wtonroot которая возвращает нам адрес рута
      const clientWTONrootAddr = await dexclient.methods.wTONroot.run();
      //получаем адрес кошелька этого рута
      const clientWTONwalletAddr = await dexclient.methods.getWalletByRoot.run({rootAddr: clientWTONrootAddr.wTONroot});
  //создаем экземпляр токен валлета
      const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, clientWTONwalletAddr.wallet);
      //берем баланс чтобы позже проверить пришли ли на него токены
      const balanceWTONbefore = await tokenWallet.methods.getBalance.run();


      const resp = await dexclient.methods.wrapTON.call({qtyTONgrams:form.nanoTokens.value});
      //если в extension пользователь отменил wrapTON, то запускаем unwrapTON
      //const unwrapTON = await dexclient.methods.unwrapTON.call();

      await resp.wait()
      //если в ответе есть code - это код какой-то ошибки, если это 508 делаем retry (делать можно смело в течении 15-25 секудн, settimeout`ом), если какая то другая значит где то косяк
      if(resp.code){
        console.log("resp.code",resp.code,"resp.message", resp.message)
        return
      }
      //чекаем изменения баланса
      let balanceWTONafter = await tokenWallet.methods.getBalance.run();

      while(parseInt(balanceWTONbefore.value0) === parseInt(balanceWTONafter.value0)){
          balanceWTONafter = await tokenWallet.methods.getBalance.run();
          console.log("tons wrapping\nbalance before",parseInt(balanceWTONbefore.value0), "balance after",parseInt(balanceWTONafter.value0), "difference", parseInt(balanceWTONafter.value0) - parseInt(balanceWTONbefore.value0))
        }
console.log("all ok, tons wrapped success")
          /*
      третьим шагом кладем на депозит обернутые тонны (wton)
    */
    // Если
      //для этого берем адрес пары на которой мы проводим сейчас свап
      let pairclientwallets = await dexclient.methods.getPair.run({value0:"0:26e9e1eb5cdd6b062959acce612b42dbe5135a40c16b47487f82c203bb5abb8a"});
      //создаем экземпляр токен валлета clientDepositA - поскольку в конкретно данном контексте свапаем токен А, в приложении это нужно реализовать как входящую переменную
      // то есть если свапаем А берем clientDepositA если б то соответственно clientDepositB
      const tokenWalletswapA = new freeton.Contract(provider, TONTokenWalletContract.abi, pairclientwallets.clientDepositA);
      //снова берем баланс ДО выполнения операции
      const walletABalancebefore = await tokenWalletswapA.methods.getBalance.run();

    

     //кладем на депозит
      let onDeposit = await dexclient.methods.makeAdepositToPair.call({pairAddr:"0:26e9e1eb5cdd6b062959acce612b42dbe5135a40c16b47487f82c203bb5abb8a",qtyA:form.nanoTokens.value});
      //чекаем что токены реально уже на балансе
      let walletABalanceafter = await tokenWalletswapA.methods.getBalance.run();
      while(parseInt(walletABalancebefore.value0) === parseInt(walletABalanceafter.value0)){
          walletABalanceafter = await tokenWalletswapA.methods.getBalance.run();
          console.log("set deposit\nbalance before",parseInt(walletABalancebefore.value0), "balance after",parseInt(walletABalanceafter.value0), "difference", parseInt(walletABalanceafter.value0) - parseInt(walletABalancebefore.value0))
        }
        console.log("make tons to deposit success")

      /*
      четвертый шаг это непосредственно свап
       */
      //здесь в качестве pairAddr должен быть адрес пары на которой мы сейчас делаем свап
      let onWalletAddressesGet = await dexclient.methods.getPairClientWallets.run({pairAddr:"0:26e9e1eb5cdd6b062959acce612b42dbe5135a40c16b47487f82c203bb5abb8a"});
      //из нее мы получаем адреса кошельков принадлежащих клиенту и привязанных к этой паре
      const walletBcontract = new freeton.Contract(provider, TONTokenWalletContract.abi, onWalletAddressesGet.walletB);
      //в конкретно данном случае мы свапаем токен А на токен Б - значит мы отдаем сколько то токенов А и проверяем сколько пришло кошелек токена Б ( onWalletAddressesGet.walletB )
      const walletBbalanceBefore = await walletBcontract.methods.getBalance.run();
      //свапаем
      let swapRes = await dexclient.methods.processSwapA.call({pairAddr:"0:26e9e1eb5cdd6b062959acce612b42dbe5135a40c16b47487f82c203bb5abb8a",qtyA:form.nanoTokens.value});
      await swapRes.wait()


      //проверяем что токены Б пришли
      let walletBbalanceAfter = await walletBcontract.methods.getBalance.run();


      while(parseInt(walletBbalanceBefore.value0) === parseInt(walletBbalanceAfter.value0)){
        walletBbalanceAfter = await walletBcontract.methods.getBalance.run();
        console.log("balance before",parseInt(walletBbalanceBefore.value0), "balance after",parseInt(walletBbalanceAfter.value0), "difference", parseInt(walletBbalanceAfter.value0) - parseInt(walletBbalanceBefore.value0))
      }
      const symbol = await walletBcontract.methods.getSymbol.run();
      console.log(`Swap success you getteed ${parseInt(walletBbalanceAfter.value0)} of ${hex2ascii(symbol.value0)}`)
      //конец

    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },


  // processLiquidity(address pairAddr, uint128 qtyA, uint128 qtyB)

  // returnAllLiquidity(address pairAddr)


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
        console.log('Pair:'+symbolA+' : '+symbolB+' addr: '+item);
        document.getElementById('result').innerHTML += '</br>' +'Pair: '+JSON.stringify(symbolA)+' : '+JSON.stringify(symbolB)+' addr: '+JSON.stringify(item);
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
  async getAddressBalance (dexClientAddress) {
    try {
      const client = new _tonclient_core__WEBPACK_IMPORTED_MODULE_1__["TonClient"]({network: { server_address: 'net.ton.dev' }});
      const balance = (await client.net.query_collection({collection: "accounts",filter: {id: {eq: dexClientAddress,},},result: "balance",})).result;
      document.getElementById('result').innerHTML += '</br>' + ' balance: '+ JSON.stringify(parseInt(balance[0].balance))
      currentBalance = parseInt(balance[0].balance)
      console.log('balance: '+currentBalance);        
    } catch (error) {
      console.log(error)  
    }  
  },

  async getBalanceTONgrams() {
    const button = document.getElementById('buttonGetBalanceTONgrams');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {

        const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
        const dexclientData = await dexclient.methods.getBalanceTONgrams.run();
        document.getElementById('clientId').value = dexclient.address;
        document.getElementById('BalanceTONgrams').value =dexclientData.balanceTONgrams; // JSON.stringify(dexclientData.balanceTONgrams);
        console.log('getBalanceTONgrams: '+dexclientData.balanceTONgrams);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },

 
  async wrapTON() {
    const button = document.getElementById('buttonGetBalanceTONgrams');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();

      const provider = _.getProvider();
      const signer = await provider.getSigner();      
      // const provider = _.getProvider();
      // const provider = _.getProvider();
      // const signer = await provider.getSigner();
      // const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {


        // const signer = await provider.getSigner();
        // const pubkey = await signer.getPublicKey();
        // const contract = new freeton.Contract(signer, DEXrootContract.abi, Radiance.networks['2'].dexroot);

        // const signer = await provider.getSigner();
        // const pubkey = await signer.getPublicKey();
        // const provider = _.getProvider();

        // const dexclient = new freeton.Contract(provider, DEXclientContract.abi, rootData.dexclient);
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient ); //rootData.dexclient); signer.wallet.address
        // const dexclientData = await dexclient.methods.getBalanceTONgrams.run();
        // const _wrapTON = await dexclient.methods.wrapTON.run({qtyTONgrams:"1000000000"});
        const qtyTONgrams = document.getElementById('wrapTON');
        const contractMessageProcessing = await dexclient.methods.wrapTON.call({qtyTONgrams:!qtyTONgrams.value?qtyTONgrams.defaultValue:qtyTONgrams.value});
        const _wrapTON = await contractMessageProcessing.wait();


        // document.getElementById('clientId').value = dexclient.address;
        // document.getElementById('BalanceTONgrams').value =dexclientData.balanceTONgrams; // JSON.stringify(dexclientData.balanceTONgrams);
        console.log('txid: '+contractMessageProcessing.txid);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },  
  
  async makeABdepositToPair(form) {
    const button = document.getElementById('buttonGetClientRoots');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

        // (address pairAddr, uint128 qtyA, uint128 qtyB) 
        const qtyA = document.getElementById('makeABqtyA');
        const qtyB = document.getElementById('makeABqtyB');

        const dexclientData = await dexclient.methods.makeABdepositToPair.call({pairAddr: form.pairAddr.value, qtyA:!qtyA.value?qtyA.defaultValue:qtyA.value, qtyB:!qtyB.value?qtyB.defaultValue:qtyB.value});
        const fds=1
        // document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        // console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },

  async makeAdepositToPair(form) {
    const button = document.getElementById('buttonGetClientRoots');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

        // (address pairAddr, uint128 qtyA, uint128 qtyB) 
        const qtyA = document.getElementById('makeAqtyA');
        // const qtyB = document.getElementById('makeAqtyB'); makeAdepositToPair

        const dexclientData = await dexclient.methods.makeAdepositToPair.call({pairAddr: form.pairAddr.value, qtyA:!qtyA.value?qtyA.defaultValue:qtyA.value }) ///, qtyB:!qtyB.value?qtyB.defaultValue:qtyB.value});
        const fds=1
        // document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        // console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },

  async makeBdepositToPair(form) {
    const button = document.getElementById('buttonGetClientRoots');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

        // (address pairAddr, uint128 qtyA, uint128 qtyB) 
        // const qtyA = document.getElementById('makeABqtyA');
        const qtyB = document.getElementById('makeBqtyB');

        const dexclientData = await dexclient.methods.makeBdepositToPair.call({pairAddr: form.pairAddr.value, qtyB: !qtyB.value?qtyB.defaultValue:qtyB.value});
        const fds=1
        // document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        // console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },

  async processSwapA(form) {
    const button = document.getElementById('buttonGetClientRoots');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

        // (address pairAddr, uint128 qtyA, uint128 qtyB) 
        const qtyA = document.getElementById('makeABqtyA');
        // const qtyB = document.getElementById('makeABqtyB');

        const dexclientData = await dexclient.methods.processSwapA.call({pairAddr: form.pairAddr.value, qtyA:!qtyA.value?qtyA.defaultValue:qtyA.value});
        const fds=1
        // document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        // console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
  
  async processSwapB(form) {
    const button = document.getElementById('buttonGetClientRoots');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

        // (address pairAddr, uint128 qtyA, uint128 qtyB) 
        // const qtyA = document.getElementById('makeABqtyA');
        const qtyB = document.getElementById('makeABqtyB');

        const dexclientData = await dexclient.methods.processSwapB.call({pairAddr: form.pairAddr.value, qtyB:!qtyB.value?qtyB.defaultValue:qtyB.value});
        const fds=1
        // document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        // console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },

  async provideLiquidity(form) {
    const button = document.getElementById('buttonProvideLiquidity');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

// processLiquidity(address pairAddr, uint128 qtyA, uint128 qtyB)
        const qtyA = document.getElementById('PLqtyA');
        const qtyB = document.getElementById('PLqtyB');
        const pairAddr = document.getElementById("PLpairAddr")

        const dexclientData = await dexclient.methods.processLiquidity.call({pairAddr: pairAddr.value, qtyA:!qtyA.value?qtyA.defaultValue:qtyA.value, qtyB:!qtyB.value?qtyB.defaultValue:qtyB.value});
        const fds=1

      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },

  async selectLiquidity(form) {
    const button = document.getElementById('buttonSelectALLLiquidity');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const pubkey = await signer.getPublicKey();
      const root = new freeton.Contract(provider, DEXrootContract.abi, Radiance.networks['2'].dexroot);
      const rootData = await root.methods.checkPubKey.run({pubkey:"0x"+pubkey});
      if (rootData.status == true) {
        const dexclient = new freeton.Contract(signer, DEXclientContract.abi, rootData.dexclient);

        // const qtyB = document.getElementById('makeABqtyB');
        const pairAddr = document.getElementById("SLpairAddr")

        const dexclientData = await dexclient.methods.returnAllLiquidity.call({pairAddr: pairAddr.value});
        const fds=1
        // document.getElementById('result').innerHTML += '</br>' + 'getAllClienRoots: '+ JSON.stringify(dexclientData.rootKeysR)
        // console.log('getAllClienRoots: '+dexclientData.rootKeysR);
        // for (const item of dexclientData.rootKeysR) {
        //   const tokenRoot = new freeton.Contract(provider, RootTokenContract.abi, item);
        //   const symbol = await tokenRoot.methods.getSymbol.run();
        //   const addr = await dexclient.methods.getWalletByRoot.run({rootAddr:item});
        //   const tokenWallet = new freeton.Contract(provider, TONTokenWalletContract.abi, addr.wallet);
        //   const balance = await tokenWallet.methods.getBalance.run();
        //   document.getElementById('result').innerHTML += '</br>' + 'symbol: '+ JSON.stringify(hex2ascii(symbol.value0))+' balance: '+ JSON.stringify(balance.value0)
        //   console.log('symbol: '+hex2ascii(symbol.value0)+' balance: '+balance.value0);
        // }
      } else {
        document.getElementById('result').innerHTML += '</br>' + 'DEXclient status false'
        console.log('DEXclient status false');
      }
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
    } finally {
      button.disabled = false;
    }
  },
    

  // returnAllLiquidity(address pairAddr)
  // getBalance

  // getAddressWTON
};
