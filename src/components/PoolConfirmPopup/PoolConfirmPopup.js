import React from 'react';
import MainBlock from '../MainBlock/MainBlock';
import TON from '../../images/tokens/TON.svg';
import wBTC from '../../images/tokens/wBTC.svg';
import wETH from '../../images/tokens/wETH.svg';
import wUSDT from '../../images/tokens/wUSDT.svg';
import CloseBtn from '../CloseBtn/CloseBtn';

function PoolConfirmPopup(props) {
  console.log(props.hideFunc);
  return (
    <div className="popup-wrapper confirm-popup">
      <MainBlock
        smallTitle={true}
        button={<CloseBtn />}
        content={
          <>
            <p className="confirm-subtitle">You will receive</p>
            <div className="confirm-block">
              <span className="confirm-value">3.2582</span>
              <img className="confirm-icon" src={TON} alt="TON"/>
              <img className="confirm-icon" src={wUSDT} alt="wUSDT"/>
              <span className="confirm-token">ETH/AMP</span>
            </div>
            <p className="confirm-text">Outpoot is estimated. If the price changes by more than 0.5% your transaction will revert</p>
            <button className="btn popup-btn">Confirm Supply</button>
          </>
        }
        hasFooter={
          <div className="mainblock-footer">
            <div className="mainblock-footer-wrap">
              <div>
                <div  className="pool-confirm-wrap">
                  <p className="mainblock-footer-value">0.0001</p>
                  <p className="mainblock-footer-subtitle">ETH deposited</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">26000700</p>
                  <p className="mainblock-footer-subtitle">AMP per ETH</p>
                </div>
              </div>
              <div>
                <div  className="pool-confirm-wrap">
                  <p className="mainblock-footer-value">10000003</p>
                  <p className="mainblock-footer-subtitle">AMP deposited</p>
                </div>
                <div>
                  <p className="mainblock-footer-value">0.0150</p>
                  <p className="mainblock-footer-subtitle">ETH per AMP</p>
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