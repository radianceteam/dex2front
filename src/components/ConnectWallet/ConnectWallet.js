import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {closeConnecting, setWalletIsConnected, showPopup} from '../../store/actions/app';
import {setPairsList, setPubKey, setTokenList, setWallet} from '../../store/actions/wallet';
import {checkPubKey, computeDEXclientAddr, createDEXclient, getClientRoots, getWallet,} from '../../freeton';
import MainBlock from '../MainBlock/MainBlock';
import CloseBtn from '../CloseBtn/CloseBtn';
import Loader from '../Loader/Loader';
import './ConnectWallet.scss';
import { setSwapFromToken, setSwapToToken } from '../../store/actions/swap';
import { setPoolFromToken, setPoolToToken } from '../../store/actions/pool';
import { getRootData, getAllPairs, getWalletBalance, getAllClientWallets } from '../../extensions/sdk/run';
import { getClientBalance } from '../../extensions/webhook/script';

function ConnectWallet() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [extIsAvailable, setExtIsAvailable] = useState(null);

  let curExt = useSelector(state => state.appReducer.curExt);

  let swapFromToken = useSelector(state => state.swapReducer.fromToken);
  let swapToToken = useSelector(state => state.swapReducer.toToken);
  
  let poolFromToken = useSelector(state => state.poolReducer.fromToken);
  let poolToToken = useSelector(state => state.poolReducer.toToken);

  useEffect(() => {
    (async function() {
      try {
        // const clientData = await getClientData();
        // const walletId = clientData.address;
        // const pairs = clientData.normlizeWallets;
        // dispatch(setWallet({id: walletId, balance: 0}));
        // dispatch(setPairsList(pairs));
        // dispatch(setWalletIsConnected(true));
        // dispatch(closeConnecting());
        const walletAddress = curExt._extLib.address;
        const clientBalance = await getClientBalance(walletAddress);
        let tokenList = await getAllClientWallets(curExt);
        tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
          {
            ...i,
            symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
          })
        );
        
        dispatch(setTokenList(tokenList));
        dispatch(setWallet({id: walletAddress, balance: clientBalance}));

        tokenList.forEach(i => {
          if(swapFromToken.symbol === i.symbol) {
            swapFromToken.balance = i.balance;
            swapFromToken.walletAddress = i.walletAddress;
            dispatch(setSwapFromToken(swapFromToken));
          } else if(swapToToken.symbol === i.symbol) {
            swapToToken.balance = i.balance;
            swapToToken.walletAddress = i.walletAddress;
            dispatch(setSwapToToken(swapToToken));
          } else if(poolFromToken.symbol === i.symbol) {
            poolFromToken.balance = i.balance;
            poolFromToken.walletAddress = i.walletAddress;
            dispatch(setPoolFromToken(poolFromToken));
          } else if(poolToToken.symbol === i.symbol) {
            poolToToken.balance = i.balance;
            poolToToken.walletAddress = i.walletAddress;
            dispatch(setPoolToToken(poolToToken));
          }
        })

        dispatch(setWalletIsConnected(true));
        dispatch(closeConnecting());
      } catch (err) {
        console.log(err);
        dispatch(closeConnecting());
        dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
      }
      // try {
      //   let pubKey = await checkPubKey();
        
      //   if(!pubKey.status) {
      //     await computeDEXclientAddr(0);
      //     await createDEXclient(0);
      //   }
        
      //   while(!pubKey.status) {
      //     pubKey = await checkPubKey();
      //     console.log('Creating DEXclient...');
      //   }
        
      //   let wallet = await getWallet();
      //   dispatch(setWallet(wallet));
      //   dispatch(setPubKey(pubKey));

      //   let tokenList = await getClientRoots();

      //   while(!tokenList.length) {
      //     tokenList = await getClientRoots();
      //     console.log('Getting token list...');
      //   }

      //   tokenList = tokenList.map(i => ({
      //     ...i,
      //     symbol: i.symbol === 'wTON' ? 'TON' : i.symbol,
      //     balance: i.symbol === 'wTON' ? +wallet.balance : i.balance,
      //   }));

      //   dispatch(setTokenList(tokenList));
      //   dispatch(setWalletIsConnected(true));
      
      //   tokenList.forEach(i => {
      //     if(swapFromToken.id === i.id) {
      //       swapFromToken.balance = i.balance;
      //       dispatch(setSwapFromToken(swapFromToken));
      //     } else if(swapToToken.id === i.id) {
      //       swapToToken.balance = i.balance;
      //       dispatch(setSwapToToken(swapToToken));
      //     } else if(poolFromToken.id === i.id) {
      //       poolFromToken.balance = i.balance;
      //       dispatch(setPoolFromToken(poolFromToken));
      //     } else if(poolToToken.id === i.id) {
      //       poolToToken.balance = i.balance;
      //       dispatch(setPoolToToken(poolToToken));
      //     }
      //   })

      //   dispatch(closeConnecting());
      // } catch(e) {
      //   console.log(e);
      //   switch (e.message) {
      //     case 'Extension not available.':
      //       setExtIsAvailable(false);
      //       setIsLoading(false);
      //       break;       
      //     case 'Cannot read property \'balance\' of undefined':
      //       dispatch(closeConnecting());
      //       dispatch(showPopup({type: 'error', message: 'Your balance is 0. Please, replenish it first.'}));
      //       break;
      //     case 'Canceled by user.':
      //       dispatch(showPopup({type: 'error', message: 'Operation canceled.'}));
      //       break;  
      //     default:
      //       dispatch(closeConnecting());
      //       dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
      //       break;
      //   }
      // }
    })()
  }, []);

  return (
    <MainBlock
      smallTitle={true}
      normalTitle={true}
      title={'Connecting wallet'}
      button={<CloseBtn func={closeConnecting} />}
      content={
        <div className="connect-wallet-center">
          {isLoading && (
            <>
              <Loader />
              <span className="connect-wallet-init-text">Initializing</span>
            </>
          )}

          {(!isLoading ) && (
            <a
              href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm"
              target="_blank"
              className="btn mainblock-btn"
            >
              <svg width="39" height="35" viewBox="0 0 39 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.8278 9.26675L30.435 1.21075C30.3129 1.07679 30.1371 1 29.9564 1H9.04421C8.86354 1 8.68775 1.07679 8.56568 1.21075L1.17283 9.26675C0.957979 9.50037 0.941703 9.85163 1.13377 10.1049L18.9827 33.7419C19.1048 33.9052 19.2969 34 19.5003 34C19.7038 34 19.8958 33.9036 20.0179 33.7419L37.8669 10.1032C38.0573 9.85163 38.0427 9.49874 37.8278 9.26675ZM22.5034 2.307L24.5689 9.05599H14.4334L16.4989 2.307H22.5034ZM24.6144 10.3614L19.5003 30.6802L14.3862 10.3614H24.6144ZM13.0434 10.3614L18.0859 30.3911L2.96163 10.3614H13.0434ZM25.9573 10.3614H36.039L20.9148 30.3911L25.9573 10.3614ZM35.8649 9.05599H25.9312L23.8657 2.307H29.6683L35.8649 9.05599ZM9.33068 2.307H15.1333L13.0678 9.05599H3.13579L9.33068 2.307Z" fill="white" stroke="white"/>
              </svg> &nbsp;Install Extraton
            </a>
          )}
        </div>
      }
    />
  )
}

export default ConnectWallet;