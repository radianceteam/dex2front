import React from 'react';
import Loader from '../Loader/Loader';
import MainBlock from '../MainBlock/MainBlock';
import './WaitingPopup.scss';

function WaitingPopup(props) {
  return (
    <MainBlock
      content={
        <div className="popup-content">
          <Loader />
          <p className="popup-loading-text">Waiting for confirmation in your wallet</p>
          { props.text && <p className="popup-loading-text popup-loading-descr">{props.text}</p>}
        </div>
      }
    />
  )
}

export default WaitingPopup;