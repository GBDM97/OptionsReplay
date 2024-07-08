import React, { ChangeEvent, useState } from 'react';
import logo from './logo.svg';
import '../App.css';
import styled from 'styled-components';
import data from '../data/data.json';
import OperationsList from '../components/OperationsList';

const OperationPage:React.FC<{index:number}> = ({index}) => {
  const [listPayload,setListPayload] = useState<Array<string>>([]);

  const indexToData = () => {
    if(index === 1){
      return {entry:data.D24062024,exit:data.D28062024}
    }
    else return {entry:'file1',exit:'file2'}
  }

  const search = (selected_asset:string) => {
    const names = indexToData();
    const fileString1 = require(names.entry);
    const fileString2 = require(names.exit);

    const formatPrice = (s:string) => {
      return String(parseInt(s.trim().replace(/^0+/, '')) / 100);
    };

    const stringSearch = (fileString:string) => {
      let linesArray = fileString.split('\n');
      linesArray.forEach((line, index)=>{
        if (index !== 0 || index < linesArray.length) {
          let current_asset = line.slice(12, 24).trim();
          if (current_asset.includes(selected_asset) && current_asset.length > 8) {
            return ('\n'+current_asset+' >>> '+
              formatPrice(line.slice(56,69))+'|'+formatPrice(line.slice(69,82))+'|'+
              formatPrice(line.slice(82,95))+'|'+formatPrice(line.slice(108,121)))
          }
        
        }
      })
      setListPayload(linesArray)
    }
    stringSearch(fileString1)
    
  }

  return (
    <div>
        <input type='text' onChange={e => search(e.target.value)}/>
        <OperationsList listPayload={listPayload}/>
    </div>
  );
}

export default OperationPage;
