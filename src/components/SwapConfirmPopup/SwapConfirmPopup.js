import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { swapA, swapB, connectToPair } from '../../extensions/sdk/run';
import { showPopup } from '../../store/actions/app';
import { setSwapAsyncIsWaiting, setSwapFromInputValue, setSwapFromToken, setSwapToInputValue, setSwapToToken } from '../../store/actions/swap';
import { setPairsList, setTokenList } from '../../store/actions/wallet';
import CloseBtn from '../CloseBtn/CloseBtn';
import MainBlock from '../MainBlock/MainBlock';
import { iconGenerator } from '../../iconGenerator';
import miniSwap from '../../images/icons/mini-swap.png';
import { checkClientPairExists, getAllClientWallets, subscribe } from '../../extensions/webhook/script';
import './SwapConfirmPopup.scss';

function SwapConfirmPopup(props) {
  const dispatch = useDispatch();

  const appTheme = useSelector(state => state.appReducer.appTheme);

  let curExt = useSelector(state => state.appReducer.curExt);
  let pubKey = useSelector(state => state.walletReducer.pubKey);

  const fromToken = useSelector(state => state.swapReducer.fromToken);
  const toToken = useSelector(state => state.swapReducer.toToken);

  const fromValue = useSelector(state => state.swapReducer.fromInputValue);
  const toValue = useSelector(state => state.swapReducer.toInputValue);

  const tokenList = useSelector(state => state.walletReducer.tokenList);

  const pairsList = useSelector(state => state.walletReducer.pairsList);
  const pairId = useSelector(state => state.swapReducer.pairId);

  async function handleSwap() {
    dispatch(setSwapAsyncIsWaiting(true));
    props.hideConfirmPopup();

    let pairIsConnected = await checkClientPairExists(pubKey.address, pairId);
    if(!pairIsConnected) {
      try {
        await connectToPair(curExt, pairId);
        let tokenList = await getAllClientWallets(pubKey.dexclient);

        if(tokenList.length) {          
          tokenList.forEach(async item => await subscribe(item.walletAddress));
          
          tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
            {
              ...i,
              symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
            })
          );
        }

        dispatch(setTokenList(tokenList));
        pairIsConnected = true;
      } catch(e) {
        dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
      }      
    }

    if(pairIsConnected) {
      try {
        await pairsList.forEach(async i => {
          if(fromToken.symbol === i.symbolA && toToken.symbol === i.symbolB) {
            await swapA(curExt, pairId, fromValue * 1000000000);
          } else if(fromToken.symbol === i.symbolB && toToken.symbol === i.symbolA) {
            await swapB(curExt, pairId, fromValue * 1000000000);
          }
        }) 
      } catch(e) {
        console.log(e);
        switch (e.message) {
          case 'Canceled by user.':
            dispatch(showPopup({type: 'error', message: 'Operation canceled.'}));
            break;
          default:
            dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
            break;
        }
        dispatch(setSwapAsyncIsWaiting(false));
      }
    }
  }

  return (
    <div className="popup-wrapper">
      <MainBlock
        button={<CloseBtn func={props.hideConfirmPopup} />}
        content={
          <>
            <p className="confirm-subtitle">Confirm Swap</p>
            <div className="confirm-block swap-confirm-block">
              <span className="confirm-token"><img className="confirm-icon" src={iconGenerator(fromToken.symbol)} alt={fromToken.symbol}/>{fromValue}</span>
              { appTheme === 'light' ?
                <svg width="68" height="19" viewBox="0 0 68 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M0.897098 10.5H64.9499L58.8496 17.3C58.4908 17.7 58.4908 18.3 58.8496 18.7C59.029 18.9 59.2982 19 59.4776 19C59.657 19 59.9261 18.9 60.1055 18.7L67.7309 10.2C68.0897 9.8 68.0897 9.2 67.7309 8.8L60.1055 0.3C59.7467 -0.1 59.2084 -0.1 58.8496 0.3C58.4908 0.7 58.4908 1.3 58.8496 1.7L64.9499 8.5H0.897098C0.358839 8.5 0 8.9 0 9.5C0 10.1 0.358839 10.5 0.897098 10.5Z" fill="url(#paint0_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="68.0035" y1="9.49999" x2="-13.031" y2="-17.3695" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#41444E"/>
                      <stop offset="1" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg> :
                <svg className="swap-confirm-arrow" width="68" height="20" viewBox="0 0 68 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M0.897098 11H64.9499L58.8496 17.8C58.4908 18.2 58.4908 18.8 58.8496 19.2C59.029 19.4 59.2982 19.5 59.4776 19.5C59.657 19.5 59.9261 19.4 60.1055 19.2L67.7309 10.7C68.0897 10.3 68.0897 9.7 67.7309 9.3L60.1055 0.8C59.7467 0.4 59.2084 0.4 58.8496 0.8C58.4908 1.2 58.4908 1.8 58.8496 2.2L64.9499 9H0.897098C0.358839 9 0 9.4 0 10C0 10.6 0.358839 11 0.897098 11Z" fill="url(#paint0_linear)"/>
                    <defs>
                    <linearGradient id="paint0_linear" x1="68.0035" y1="9.99999" x2="-13.031" y2="-16.8695" gradientUnits="userSpaceOnUse">
                      <stop stop-color="white"/>
                      <stop offset="1" stop-color="white" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              }
              <span className="confirm-value"><img className="confirm-icon" src={iconGenerator(toToken.symbol)} alt={toToken.symbol}/>{toValue.toFixed(4)}</span>
            </div>
            <p className="confirm-text">
              Output is estimated. You will receive at least <span>{toValue.toFixed(4)} {toToken.symbol}</span> or the transaction will revert
            </p>
            <button className="btn popup-btn" onClick={() => handleSwap()}>Confirm Swap</button>
          </>
        }
        footer={
          <div className="mainblock-footer">
            <div className="mainblock-footer-wrap">
              <div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value"><img src={miniSwap} alt=""/> {toValue.toFixed(4)} {toToken.symbol}/{fromToken.symbol}</p>
                  <p className="mainblock-footer-subtitle">Price</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">{toValue.toFixed(4)} {toToken.symbol}</p>
                  <p className="mainblock-footer-subtitle">Minimum received</p>
                </div>
              </div>
              <div>
                <div className="swap-confirm-wrap">
                  <p className="mainblock-footer-value">0.03%</p>
                  <p className="mainblock-footer-subtitle">Price Impact</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">0.003 {toToken.symbol}</p>
                  <p className="mainblock-footer-subtitle">Liquidity Provider Fee</p>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default SwapConfirmPopup;
