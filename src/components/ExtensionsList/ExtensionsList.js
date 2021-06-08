import React from 'react';
import { checkExtensions } from '../../extensions/extensions/checkExtensions';
import  extratonIcon from '../../extensions/extratonIcon.png'
import  broxusIcon from '../../extensions/broxusIcon.png'
import './ExtensionsList.scss';

const extensions = await checkExtensions();

function extensionIcon(name) {
  switch (name) {
    case 'extraton':
      return extratonIcon;
    case 'broxus':
      return broxusIcon;
    default:
      break;
  }
}

function ExtensionsList() {
  const handleClick = name => {

  }

  return (
    <MainBlock
      title={'Select an extension'}
      button={<CloseBtn />}
      content={
        <div className="extensions-list">
          {extensions.map(item => (
            <div className="extensions-list-item" onCLick={handleClick(item.name)}>
              <img src={extensionIcon(item.name)} alt={item.name} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      }
    />
  )
}

export default ExtensionsList;