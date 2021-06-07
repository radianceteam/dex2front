import React from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, showAccount } from '../../store/actions/app';
import './Wallet.scss' 

function Wallet() {
  const history = useHistory();
  const dispatch = useDispatch();

  let curExt = useSelector(state => state.appReducer.curExt);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const wallet = useSelector(state => state.walletReducer.wallet);

  const handleClick = () => {
    dispatch(connectWallet());
    history.push('/account');
  }

  return (
    <div className="wallet">
      {!walletIsConnected ?
        <button className="btn wallet-btn" disabled={!curExt.name} onClick={handleClick}>Connect wallet</button> :
        <div className="wallet-wrap" onClick={() => history.push('/account')}>
          <span className="wallet-ballance">{wallet.balance.toFixed(4)} TON</span>
          <span className="wallet-key">{wallet.id.slice(0, 5)}...{wallet.id.slice(-4)}</span>
        </div>
      }
    </div>
  )
}

export default Wallet;