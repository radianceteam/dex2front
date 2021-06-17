import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Redirect, useLocation, useHistory} from 'react-router-dom';
import {changeTheme, setCurExt, setExtensionsList, setWalletIsConnected, showPopup} from './store/actions/app';
import {setLiquidityList, setPairsList, setPubKey, setSubscribeData, setTokenList, setTransactionsList, setWallet} from './store/actions/wallet';
import { getAllClientWallets, getAllPairsWoithoutProvider, getClientBalance, subscribe } from './extensions/webhook/script';
import { checkExtensions, getCurrentExtension } from './extensions/extensions/checkExtensions';
import { setSwapAsyncIsWaiting, setSwapFromInputValue, setSwapFromToken, setSwapToInputValue, setSwapToToken } from './store/actions/swap';
import { setPoolAsyncIsWaiting, setPoolFromInputValue, setPoolFromToken, setPoolToInputValue, setPoolToToken } from './store/actions/pool';
import { setManageAsyncIsWaiting, setManageBalance, setManageFromToken, setManagePairId, setManageRateAB, setManageRateBA, setManageToToken } from './store/actions/manage';
import Account from './pages/Account/Account';
import Swap from './pages/Swap/Swap';
import Pool from './pages/Pool/Pool';
import Popup from './components/Popup/Popup';
import Header from './components/Header/Header'
import Manage from './pages/Manage/Manage';
import AddLiquidity from './pages/AddLiquidity/AddLiquidity';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const popup = useSelector(state => state.appReducer.popup);
  const appTheme = useSelector(state => state.appReducer.appTheme);
  const pubKey = useSelector(state => state.walletReducer.pubKey);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const swapAsyncIsWaiting = useSelector(state => state.swapReducer.swapAsyncIsWaiting);
  const transactionsList = useSelector(state => state.walletReducer.transactionsList);
  const poolAsyncIsWaiting = useSelector(state => state.poolReducer.poolAsyncIsWaiting);
  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const liquidityList = useSelector(state => state.walletReducer.liquidityList);


  const manageAsyncIsWaiting = useSelector(state => state.manageReducer.manageAsyncIsWaiting);
  const subscribeData = useSelector(state => state.walletReducer.subscribeData);
  const curExt = useSelector(state => state.appReducer.curExt);

  const chrome = localStorage.getItem("chrome");
  if(chrome === null) showChromePopup();
  else if(chrome === "false") showChromePopup();

  function showChromePopup() {
    dispatch(showPopup({type: 'chrome'}));
    localStorage.setItem("chrome", "true");
  }

  useEffect(async () => {
    const theme = localStorage.getItem('appTheme') === null ? 'light' : localStorage.getItem('appTheme');
    if(appTheme !== theme) dispatch(changeTheme(theme));

    const extensionsList = await checkExtensions();

    console.log("1",2)
    dispatch(setExtensionsList(extensionsList));
    console.log("1",3)

    const curExtname = localStorage.getItem('extName') === null ? {} : localStorage.getItem('extName');
    //
    // console.log("1",curExtname)
    let curExtt = await getCurrentExtension(curExtname)
    // console.log("1",5)
    dispatch(setCurExt(curExtt));

    const wallet = localStorage.getItem('wallet') === null ? {} : JSON.parse(localStorage.getItem('wallet'));
    if(wallet.id) {
      dispatch(setWallet(wallet));
      dispatch(setWalletIsConnected(true));
    }
    const pairs = await getAllPairsWoithoutProvider();
    console.log("pairs",pairs)
    dispatch(setPairsList(pairs));

    const pubKey = localStorage.getItem('pubKey') === null ? {} : JSON.parse(localStorage.getItem('pubKey'));

    console.log("1",6)
    if(pubKey.status) dispatch(setPubKey(pubKey));

    // const tokenList = getAllClientWallets(pubKey.address)

    // const tokenList = localStorage.getItem('tokenList') === null ? tokenList : JSON.parse(localStorage.getItem('tokenList'));
    console.log("pubKey.address",pubKey)

    let tokenList = await getAllClientWallets(pubKey.dexclient);
    let liquidityList = [];
    // console.log('token list',tokenList,"pubKey.address",pubKey.address);
    if(tokenList.length) {
      console.log('token list');
      tokenList.forEach(async item => await subscribe(item.walletAddress));

      liquidityList = tokenList.filter(i => i.symbol.includes('/'));

      tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
          {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
          })
      );
      localStorage.setItem('tokenList', JSON.stringify(tokenList));
      localStorage.setItem('liquidityList', JSON.stringify(liquidityList));
      dispatch(setTokenList(tokenList));
      dispatch(setLiquidityList(liquidityList));
    }
//TODO
    const transactionsList = localStorage.getItem('transactionsList') === null ? [] : JSON.parse(localStorage.getItem('transactionsList'));
    if(transactionsList.length) dispatch(setTransactionsList(transactionsList));


  }, []);



  useEffect(() => {
    window.addEventListener('beforeunload', function(e) {
      if(swapAsyncIsWaiting || poolAsyncIsWaiting || manageAsyncIsWaiting) e.returnValue = ''
    })
  }, [swapAsyncIsWaiting, poolAsyncIsWaiting, manageAsyncIsWaiting]);

  useEffect(async () => {
    if(subscribeData.dst) {
      const clientBalance = await getClientBalance(pubKey.address);

      let item = localStorage.getItem("currentElement");
      if(transactionsList[item]) transactionsList[item].toValue = subscribeData.amountOfTokens / 1e9;
      if (transactionsList.length) dispatch(setTransactionsList(transactionsList));
      let msgiAddress = curExt._extLib.address;
      let msigBalance = await getClientBalance(msgiAddress);
      dispatch(setWallet({id: msgiAddress, balance: msigBalance}));


      //dispatch(setWallet({id: msgiAddress, balance: msigBalance}));

      let tokenList = await getAllClientWallets(pubKey.address);
      let liquidityList = [];
      console.log('token list',tokenList,"pubKey.address",pubKey.address);
      if(tokenList.length) {
        console.log('token list');
        tokenList.forEach(async item => await subscribe(item.walletAddress));

        liquidityList = tokenList.filter(i => i.symbol.includes('/'));

        tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
          {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
          })
        );

        dispatch(setTokenList(tokenList));
        dispatch(setLiquidityList(liquidityList));
      }

      if(swapAsyncIsWaiting) {
        dispatch(showPopup({type: 'success', link: subscribeData.transactionID}));
        dispatch(setSwapFromToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setSwapToToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setSwapFromInputValue(0));
        dispatch(setSwapToInputValue(0));
        dispatch(setSwapAsyncIsWaiting(false));
      } else if(poolAsyncIsWaiting) {
        dispatch(showPopup({type: 'success', link: subscribeData.transactionID}));
        dispatch(setPoolFromToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setPoolToToken({
          walletAddress: '',
          symbol: '',
          balance: 0
        }));
        dispatch(setPoolFromInputValue(0));
        dispatch(setPoolToInputValue(0));
        dispatch(setPoolAsyncIsWaiting(false));
      } else if(manageAsyncIsWaiting) {
        dispatch(showPopup({type: 'success', link: subscribeData.transactionID}));
        dispatch(setManageFromToken({
          symbol: '',
          reserve: 0
        }));
        dispatch(setManageToToken({
          symbol: '',
          reserve: 0
        }));
        dispatch(setManageBalance(0));
        dispatch(setManagePairId(''));
        dispatch(setManageRateAB(0));
        dispatch(setManageRateBA(0));
        dispatch(setManageAsyncIsWaiting(false));
        history.push('/pool')
      }
    }
  }, [subscribeData]);

  return (
    <>

      <Header />
      <Switch location={location}>
        <Route path="/account" component={Account} />
        <Route path="/swap" component={Swap} />
        <Route path="/pool"  component={Pool} />
        <Route path="/add-liquidity" component={AddLiquidity} />
        <Route path="/manage" render={() => !walletIsConnected ? <Redirect to="/pool" /> : <Manage />} />
        <Redirect from="" to="/swap" />
      </Switch>

      {popup.isVisible && <Popup type={popup.type} message={popup.message} link={popup.link} />}
    </>
  );
}

export default App;
