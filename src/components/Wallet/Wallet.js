import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, showAccount } from '../../store/actions/app';
import './Wallet.scss' 

function Wallet() {
  const dispatch = useDispatch();
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const wallet = useSelector(state => state.walletReducer.wallet);

  return (
    <div className="wallet">
      {!walletIsConnected ?
        <button className="btn wallet-btn" onClick={() => dispatch(connectWallet())}>Connect wallet</button> :
        <div className="wallet-wrap" onClick={() => dispatch(showAccount())}>
          <span className="wallet-ballance">{wallet.balance.toFixed(4)} TON</span>
          <span className="wallet-key">{wallet.id.slice(0, 5)}...{wallet.id.slice(-4)}</span>
        </div>
      }
    </div>
  )
}

export default Wallet;