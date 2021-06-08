import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import Slider from 'react-rangeslider'
import MainBlock from '../../components/MainBlock/MainBlock';
import ManageConfirmPopup from '../../components/ManageConfirmPopup/ManageConfirmPopup';
import './Manage.scss';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Manage() {
  const dispatch = useDispatch();
  let query = useQuery();

  const appTheme = useSelector(state => state.appReducer.appTheme);

  const tokenList = useSelector(state => state.walletReducer.tokenList);

  const [managePopupIsVisible, setManagePopupIsVisible] = useState(true);
  const [manageRemoveIsVisible, setManageRemoveIsVisible] = useState(false);

  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');

  const [rangeValue, setRangeValue] = useState(0);

  useEffect(() => {
    tokenList.forEach(i => {
      if(i.id === query.get('fromSymbol')) {
        setFromToken({...i})
      } else if (i.id === query.get('toSymbol')) {
        setToToken({...i})
      }
    })
  }, [])

  function toggleClick() {
    setManagePopupIsVisible(!managePopupIsVisible);
    setManageRemoveIsVisible(!manageRemoveIsVisible);
  }

  return(
    <div className="container">
      { managePopupIsVisible && <ManageConfirmPopup func={toggleClick.bind(this)} /> }

      { manageRemoveIsVisible && (
        <MainBlock
          smallTitle={false}
          title={
            <Link to={'/pool'} className="pool-back">
              <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.9142 4.4108C11.6953 3.62975 11.6953 2.36342 10.9142 1.58237C10.1332 0.80132 8.86684 0.80132 8.08579 1.58237L10.9142 4.4108ZM2.5 9.99658L1.08579 8.58237C0.304738 9.36342 0.304738 10.6297 1.08579 11.4108L2.5 9.99658ZM8.08579 18.4108C8.86683 19.1918 10.1332 19.1918 10.9142 18.4108C11.6953 17.6297 11.6953 16.3634 10.9142 15.5824L8.08579 18.4108ZM8.08579 1.58237L1.08579 8.58237L3.91421 11.4108L10.9142 4.4108L8.08579 1.58237ZM1.08579 11.4108L8.08579 18.4108L10.9142 15.5824L3.91421 8.58237L1.08579 11.4108Z" fill="white"/>
              </svg>
              Remove Liquidity
            </Link>
          }
          content={
            <div className="manage">
              <div className="manage-percents">
                <span className="manage-percent-value">{rangeValue}%</span>
                <div className="manage-percents-btns">
                  <div className="manage-percent-btn" onClick={() => setRangeValue(25)}>25%</div>
                  <div className="manage-percent-btn" onClick={() => setRangeValue(50)}>50%</div>
                  <div className="manage-percent-btn" onClick={() => setRangeValue(75)}>75%</div>
                  <div className="manage-percent-btn" onClick={() => setRangeValue(100)}>100%</div>
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={rangeValue}
                onChange={value => setRangeValue(value)}
                tooltip={false}
              />
              <p className="manage-subtitle">Amount</p>
              <div className="manage-token-wrapper">
                <div className="manage-token-balance">3.485</div>
                <div className="manage-token-symbol">ETH</div>
              </div>
              <div className="manage-token-wrapper">
                <div className="manage-token-balance">0.997328</div>
                <div className="manage-token-symbol">AMP</div>
              </div>
              <p className="manage-subtitle">Price</p>
              <p className="manage-text">1 AMP = 0.0151100 ETH</p>
              <p className="manage-text">1 ETH = 1511000 AMP</p>
              <button className="btn mainblock-btn">Remove</button>
            </div>
          }
        />
      )}
    </div>
  )
}

export default Manage;