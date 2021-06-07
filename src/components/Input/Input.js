import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { hidePopup, showPopup } from '../../store/actions/app';
import { setSwapFromInputValue, setSwapRate, setSwapToInputValue, showSwapFromSelect, showSwapToSelect } from '../../store/actions/swap';
import { setPoolFromInputValue, setPoolRate, setPoolToInputValue, showPoolFromSelect, showPoolToSelect } from '../../store/actions/pool';
import { _ } from '../../freeton';
import Select from '../Select/Select'
import './Input.scss';
import { iconGenerator } from '../../iconGenerator';
import { getPairReserves } from '../../extensions/sdk/run';

function Input(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  const swapFromSelectIsVisible = useSelector(state => state.swapReducer.swapFromSelectIsVisible);
  const swapToSelectIsVisible = useSelector(state => state.swapReducer.swapToSelectIsVisible);

  const poolFromSelectIsVisible = useSelector(state => state.poolReducer.poolFromSelectIsVisible);
  const poolToSelectIsVisible = useSelector(state => state.poolReducer.poolToSelectIsVisible);

  const swapFromToken = useSelector(state => state.swapReducer.fromToken);
  const swapToToken = useSelector(state => state.swapReducer.toToken);
  
  const poolFromToken = useSelector(state => state.poolReducer.fromToken);
  const poolToToken = useSelector(state => state.poolReducer.toToken);

  const pairsList = useSelector(state => state.walletReducer.pairsList);

  const swapRate = useSelector(state => state.swapReducer.rate);
  const poolRate = useSelector(state => state.poolReducer.rate);

  const [value, setValue] = useState(props.value);

  useEffect(async () => {
    if(location.pathname.includes('swap') && swapFromToken.symbol && swapToToken.symbol) {
      pairsList.forEach(i => {
        if(i.symbolA === swapFromToken.symbol && i.symbolB === swapToToken.symbol) {
          dispatch(setSwapRate(i.rateAB));
        } else if(i.symbolB === swapFromToken.symbol && i.symbolA === swapToToken.symbol) {
          dispatch(setSwapRate(i.rateBA));
        }
      })
    }
    if(location.pathname.includes('add-liquidity') && poolFromToken.symbol && poolToToken.symbol) {
      pairsList.forEach(i => {
        if(i.symbolA === poolFromToken.symbol && i.symbolB === poolToToken.symbol) {
          dispatch(setPoolRate(i.rateAB));
        } else if(i.symbolB === poolFromToken.symbol && i.symbolA === poolToToken.symbol) {
          dispatch(setPoolRate(i.rateBA));
        }
      })
    }
  }, [swapFromToken, swapToToken, poolFromToken, poolToToken, pairsList])
  
  useEffect(() => {
    changeValue();    
  }, [value, swapRate, poolRate])


  async function handleClick() {
    try {
      await _.checkExtensionAvailability();
      if(location.pathname.includes('swap')) {
        if(props.type === 'to' && !swapFromToken.symbol) {
          dispatch(showPopup({type: 'error', message: 'Please, choose from token first.'}));
        } else {
          dispatch(props.type === 'from' ? showSwapFromSelect() : showSwapToSelect());
        }
      } else if(location.pathname.includes('add-liquidity')) {
        if(props.type === 'to' && !poolFromToken.symbol) {
          dispatch(showPopup({type: 'error', message: 'Please, choose from token first.'}));
        } else {
          dispatch(props.type === 'from' ? showPoolFromSelect() : showPoolToSelect());
        }
      }
    } catch(e) {
      if(e.message === 'Extension not available.') {
        dispatch(showPopup({type: 'extension'}));
      }
    }
  }

  function changeValue() {
    if(location.pathname.includes('swap')) {
      if(props.type === 'from') {
        dispatch(setSwapFromInputValue(value));
        dispatch(setSwapToInputValue(value * swapRate));
      }
    } else if(location.pathname.includes('add-liquidity')) {
      if(props.type === 'from') {
        dispatch(setPoolFromInputValue(value));
        dispatch(setPoolToInputValue(value * poolRate));
      }
    }
  }

  function handleKeyPress(event) {
    if(event.key === '-' || event.key === '+') { event.preventDefault() }
  }

  return (
    <>
      <div className="input">
        <div className="input-wrapper">
          <span className="input-title">{props.text}</span>
          <span className="input-balance">{(walletIsConnected && props.token.symbol) && `Balance: ${props.token.balance > 0 ? props.token.balance.toFixed(4) : props.token.balance}`}</span>
        </div>
        <div className="input-wrapper">
          <input
            type="number"
            className="input-field"
            value={props.value > 0 ? props.value : ''}
            onChange={event => setValue(parseFloat(event.target.value))}
            onKeyPress={event => handleKeyPress(event)}
            readOnly={props.type === 'to'}
            min="0"
            placeholder="0"
          />
          
          { !props.token.symbol ? (
            <button className="btn input-btn" onClick={() => handleClick()}>
              Select a token
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L3.06066 0.93934ZM8 8L6.93934 9.06066C7.52513 9.64645 8.47487 9.64645 9.06066 9.06066L8 8ZM15.0607 3.06066C15.6464 2.47487 15.6464 1.52513 15.0607 0.93934C14.4749 0.353553 13.5251 0.353553 12.9393 0.93934L15.0607 3.06066ZM0.93934 3.06066L6.93934 9.06066L9.06066 6.93934L3.06066 0.93934L0.93934 3.06066ZM9.06066 9.06066L15.0607 3.06066L12.9393 0.93934L6.93934 6.93934L9.06066 9.06066Z" fill="white"/>
              </svg>
            </button>
          ) : (
            <>
              { (walletIsConnected && props.type === 'from') && <button className="input-max" onClick={() => setValue(props.token.balance)}>MAX</button> }
              <button className="input-select" onClick={() => handleClick()}>
                <img src={iconGenerator(props.token.symbol)} alt={props.token.symbol} className="input-token-img"/>
                <span>{props.token && props.token.symbol}</span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.06066 0.93934C2.47487 0.353553 1.52513 0.353553 0.93934 0.93934C0.353553 1.52513 0.353553 2.47487 0.93934 3.06066L3.06066 0.93934ZM8 8L6.93934 9.06066C7.52513 9.64645 8.47487 9.64645 9.06066 9.06066L8 8ZM15.0607 3.06066C15.6464 2.47487 15.6464 1.52513 15.0607 0.93934C14.4749 0.353553 13.5251 0.353553 12.9393 0.93934L15.0607 3.06066ZM0.93934 3.06066L6.93934 9.06066L9.06066 6.93934L3.06066 0.93934L0.93934 3.06066ZM9.06066 9.06066L15.0607 3.06066L12.9393 0.93934L6.93934 6.93934L9.06066 9.06066Z" fill="white"/>
                </svg>
              </button>
            </>
            )}
        </div>
      </div>

      { (swapFromSelectIsVisible && props.type === 'from') && <Select type={props.type} /> }
      { (swapToSelectIsVisible && props.type === 'to') && <Select type={props.type} /> }

      { (poolFromSelectIsVisible && props.type === 'from') && <Select type={props.type} /> }
      { (poolToSelectIsVisible && props.type === 'to') && <Select type={props.type} /> }
    </>
  )
}

export default Input;