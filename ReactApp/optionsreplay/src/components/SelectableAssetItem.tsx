import React, { useState } from 'react';
import '../App.css';

const SelectableAssetItem:React.FC<{asset:string}> = ({asset}) => {
const [selected, setSelected] = useState(false);

  return (
    <div className='hover-effect' style={{backgroundColor:selected?'#00AAFF':'black'}} 
    onClick={()=>setSelected(p=>!p)}>
      {asset}
    </div>
  );
}

export default SelectableAssetItem;
