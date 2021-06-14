import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { iconGenerator } from '../../iconGenerator';
import './PoolExplorerItem.scss';

function PoolExplorerItem(props) {
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const [isVisible, setVisible] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(props.pairAddress);
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
              <div className="poolExplorer__pair_block">
                <div className="poolExplorer__pair">
                  <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>
                  <p className="select-item-title">{props.pair.symbolA}</p>
                </div>
                <div className="poolExplorer__pair">
                  <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>
                  <p className="select-item-title">{props.pair.symbolB}</p>
                </div>
              </div>
          </div>

          <span className="select-item-descr">{!isVisible &&  "Rate: " + parseFloat(props.pair.rateAB).toFixed(4)} {isVisible && "Address copied"}</span>

            <div>
              <div className="poolExplorer__reserve">
                <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>
                {(parseFloat(props.pair.reserveA) / 1e9).toFixed(4)}
              </div>
              <div className="poolExplorer__reserve">
                <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>
                {(parseFloat(props.pair.reservetB) / 1e9).toFixed(4)}
              </div>
            </div>
          </div>


        <div className="select-item" onClick={copyAddress}>
          <div className="select-item-wrapper">
            <div className="poolExplorer__pair_block">
              <div className="poolExplorer__pair">
                <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>
                <p className="select-item-title">{props.pair.symbolB}</p>
              </div>
              <div className="poolExplorer__pair">
                <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>
                <p className="select-item-title">{props.pair.symbolA}</p>
              </div>
            </div>
          </div>
          <span className="select-item-descr">{!isVisible &&  "Rate: " + parseFloat(props.pair.rateBA).toFixed(4)} {isVisible && "Address copied"}</span>

            <div>
              <div className="poolExplorer__reserve">
                <img  className="poolExplorer__icon" src={iconGenerator(props.pair.symbolB)} alt={props.pair.symbolB}/>
                {(parseFloat(props.pair.reservetB) / 1e9).toFixed(4)}
              </div>
              <div className="poolExplorer__reserve">
                <img className="poolExplorer__icon" src={iconGenerator(props.pair.symbolA)} alt={props.pair.symbolA}/>
                {(parseFloat(props.pair.reserveA) / 1e9).toFixed(4)}
              </div>
            </div>
          </div>
      </React.Fragment>
  )
}

export default PoolExplorerItem;
