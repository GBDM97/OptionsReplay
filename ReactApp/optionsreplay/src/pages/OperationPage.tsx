import React, { ChangeEvent, useState } from 'react';
import logo from './logo.svg';
import '../App.css';
import styled from 'styled-components';
import OperationsList from '../components/OperationsList';

const OperationPage:React.FC<{index:number}> = ({index}) => {
  const [listPayload,setListPayload] = useState([]);

  const indexToFileNames = () => {
    if(index === 1){
      return {entry:'D24062024',exit:'D28062024'}
    }
    else return {entry:'file1',exit:'file2'}
  }

  const search = (e:ChangeEvent) => {
    const names = indexToFileNames();
    const fileString1 = require(names.entry);
    const fileString2 = require(names.exit);
    
  }

  return (
    <div>
        <input type='text' onChange={e => search(e)}/>
        <OperationsList listPayload={listPayload}/>
    </div>
  );
}

export default OperationPage;
