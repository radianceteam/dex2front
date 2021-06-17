import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { iconGenerator } from '../../iconGenerator';
import './Item.scss';

function getFullName(name){
  console.log("name",name)
  if(name === "TON"){
    return "TON Crystal"
  }else if(name === "fBTC"){
    return "Bitcoin"
  }else if(name === "WETH"){
    return "Ethereum"
  }else if(name === "fETH"){
    return "Ethereum"
  }else if(name === "WBTC"){
    return "Bitcoin"
  }else if(name === "DS-TON/USDT"){
    return "Pool tokens of TON/USDT pair"
  }else if(name === "DS-TON/ETH"){
    return "Pool tokens of TON/ETH pair"
  }else if(name === "DS-TON/BTC"){
    return "Pool tokens of TON/BTC pair"
  }else if(name === "USDT"){
    return "USDT Tether"
  }else{
    return "default tokens"
  }
}


function Item(props) {
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const [isVisible, setVisible] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(props.walletAddress);
    await setVisible(true);
    await timer();
  }

  function timer() {
    setTimeout(() => {
      setVisible(false);
    }, 1000)
  }
  return (
      <React.Fragment>
        <div className="select-item" onClick={copyAddress}>
          <div className="select-item-wrapper">
            <img src={iconGenerator(props.symbol)} alt={props.symbol}/>
            <div>
              <p className="select-item-title">{props.symbol}</p>
              <p className="select-item-descr">{!isVisible && getFullName(props.symbol)} {isVisible && "Address copied"}</p>
            </div>
          </div>
          { walletIsConnected && <span className="select-item-balance">{props.balance > 0 ? parseFloat(props.balance.toFixed(4)) : props.balance}</span> }
        </div>
      </React.Fragment>
  )
}

export default Item;
