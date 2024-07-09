import React, { useState } from 'react';
import '../App.css';
import { AssetInfo } from '../pages/OperationPage';

const OperationsList:React.FC<{listPayload:AssetInfo}> = ({listPayload}) => {

  return (
    <div>
      {Object.entries(listPayload).map(([asset, prices])=><>
        <p>{asset}</p>
        <p>{prices.map(p=><span style={{margin:'5px'}}>{p}</span>)}</p>
        </>)}
    </div>
  );
}

export default OperationsList;
