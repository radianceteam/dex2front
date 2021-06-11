import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPoolAsyncIsWaiting } from '../../store/actions/pool';
import { processLiquidity } from '../../extensions/sdk/run';
import { showPopup } from '../../store/actions/app';
import { iconGenerator } from '../../iconGenerator';
import MainBlock from '../MainBlock/MainBlock';
import CloseBtn from '../CloseBtn/CloseBtn';

function PoolConfirmPopup(props) {
  const dispatch = useDispatch();

  let curExt = useSelector(state => state.appReducer.curExt);

  const fromToken = useSelector(state => state.poolReducer.fromToken);
  const toToken = useSelector(state => state.poolReducer.toToken);

  const fromValue = useSelector(state => state.poolReducer.fromInputValue);
  const toValue = useSelector(state => state.poolReducer.toInputValue);

  const pairId = useSelector(state => state.poolReducer.pairId);

  async function handleSuply() {
    dispatch(setPoolAsyncIsWaiting(true));
    props.hideConfirmPopup();

    try {
      await processLiquidity(curExt, pairId, fromValue * 1000000000, toValue * 1000000000);
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
      dispatch(setPoolAsyncIsWaiting(false));
    }
  }

  return (
    <div className="popup-wrapper confirm-popup">
      <MainBlock
        smallTitle={true}
        button={<CloseBtn func={props.hideConfirmPopup} />}
        content={
          <>
            <p className="confirm-subtitle">You will receive</p>
            <div className="confirm-block">
              <span className="confirm-value">3.2582</span>
              <img className="confirm-icon" src={iconGenerator(fromToken.symbol)} alt={fromToken.symbol}/>
              <img className="confirm-icon" src={iconGenerator(toToken.symbol)} alt={toToken.symbol}/>
              <span className="confirm-token">{fromToken.symbol}/{toToken.symbol}</span>
            </div>
            <p className="confirm-text">Outpoot is estimated. If the price changes by more than 0.5% your transaction will revert</p>
            <button className="btn popup-btn" onClick={() => handleSuply()}>Confirm Supply</button>
          </>
        }
        footer={
          <div className="mainblock-footer">
            <div className="mainblock-footer-wrap">
              <div>
                <div  className="pool-confirm-wrap">
                  <p className="mainblock-footer-value">0.0001</p>
                  <p className="mainblock-footer-subtitle">{fromToken.symbol} deposited</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">{props.rateBA.toFixed(7)}</p>
                  <p className="mainblock-footer-subtitle">{fromToken.symbol} per {toToken.symbol}</p>
                </div>
              </div>
              <div>
                <div  className="pool-confirm-wrap">
                  <p className="mainblock-footer-value">10000003</p>
                  <p className="mainblock-footer-subtitle">{toToken.symbol} deposited</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">{props.rateAB.toFixed(7)}</p>
                  <p className="mainblock-footer-subtitle">{toToken.symbol} per {fromToken.symbol}</p>
                </div>
              </div>
              <div>
                <div  className="pool-confirm-wrap">
                  <p className="mainblock-footer-value">999785</p>
                  <p className="mainblock-footer-subtitle">Rates</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">&lt;0.01%</p>
                  <p className="mainblock-footer-subtitle">Share of Pool</p>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default PoolConfirmPopup;