import React, { useState } from 'react';
import '../App.css';

const OperationsList:React.FC<{listPayload:Array<string>}> = ({listPayload}) => {

  return (
    <div>
        {listPayload.map(i=>i)}
    </div>
  );
}

export default OperationsList;
