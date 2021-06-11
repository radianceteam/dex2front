import React from 'react';
import { Link } from 'react-router-dom';
import { iconGenerator } from '../../iconGenerator';
import './LiquidityItem.scss';

function LiquidityItem({walletAddress, symbol}) {
  const symbols = symbol.split('/');
  
  return (
    <div className="liquidity-item">
      <div>
        <img src={iconGenerator(symbols[0])} alt={symbols[0]} />
        <img src={iconGenerator(symbols[1])} alt={symbols[1]} />
        <span className="liquidity-item-text">{symbols[0]}/{symbols[1]}</span>
      </div>
      <Link to={'/manage?fromSymbol=0:63e60c263fd73436caf57a8b783f078822c22bf761b6c0ad79cc9e218c5b6faa&toSymbol=0:327518a58690234e6baa5ae3724198cc8689c3d8b35f6433c07f12b06d796b0c'} className="liquidity-item-btn">Manage</Link>
    </div>
  )
}

export default LiquidityItem;