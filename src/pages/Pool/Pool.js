import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import MainBlock from '../../components/MainBlock/MainBlock';
import LiquidityItem from '../../components/LiquidityItem/LiquidityItem';
import './Pool.scss';

function Pool () {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);

  return (
    <div className="container">
      <MainBlock
        class={'pool'}
        title={'Your liquidity'}
        button={
          <Link to="/add-liquidity" className="btn liquidity-btn">Add liquidity</Link>
        }
        content={
          !walletIsConnected ?
            <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button> :
            <>
              <LiquidityItem />
              <LiquidityItem />
              <LiquidityItem />
              <LiquidityItem />
            </>
        }
      />
    </div>
  )
}

export default Pool;