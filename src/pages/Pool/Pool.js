import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { connectWallet } from '../../store/actions/app';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ConnectWallet from '../../components/ConnectWallet/ConnectWallet';
import Account from '../../components/Account/Account';
import Header from './../../components/Header/Header';
import MainBlock from '../../components/MainBlock/MainBlock';
import LiquidityItem from '../../components/LiquidityItem/LiquidityItem';
import AddLiquidity from '../../components/AddLiquidity/AddLiquidity';
import './Pool.scss';

function Pool () {
  const dispatch = useDispatch();
  const location = useLocation();

  const connectingWallet = useSelector(state => state.appReducer.connectingWallet);
  const accountIsVisible = useSelector(state => state.appReducer.accountIsVisible);
  const wallet = useSelector(state => state.walletReducer.wallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  return (
    <div className="container">
      { (connectingWallet && !accountIsVisible) && <ConnectWallet /> }

      { (!connectingWallet && !accountIsVisible) && (
          <MainBlock
            class={'pool'}
            title={'Your liquidity'}
            button={
              <Link to="/add-liquidity" className="btn liquidity-btn">Add liquidity</Link>
            }
            content={
              !walletIsConnected ?
                <button className="btn mainblock-btn" onClick={() => dispatch(connectWallet())}>Connect wallet</button> :
                <>
                  <LiquidityItem />
                  <LiquidityItem />
                  <LiquidityItem />
                  <LiquidityItem />
                </>
            }
          />
      )}

      { accountIsVisible && <Account /> }
    </div>
  )
}

export default Pool;