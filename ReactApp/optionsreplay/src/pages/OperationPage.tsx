import React, { useState } from 'react';
import logo from './logo.svg';
import '../App.css';
import styled from 'styled-components';
import data from '../data/data.json';
import OperationsList from '../components/OperationsList';

export type AssetInfo = {
  [key: string]: string[]
}

const OperationPage:React.FC<{index:number}> = ({index}) => {
  const [listPayload,setListPayload] = useState<AssetInfo>({});

  const indexToData = () => {
    return {entry:data.D24062024,exit:data.D28062024}
  }

  const search = (search_string:string) => {
    if(search_string === ''){setListPayload({});return;}
    const selectedData = indexToData();
    const fileString1 = selectedData.entry;
    const fileString2 = selectedData.exit;

    const formatPrice = (s:string) => {
      return String(parseInt(s.trim().replace(/^0+/, '')) / 100);
    };

    const jsonSearch = (dateJson:{[key: string]: string[]}) => {
      setListPayload({})
      Object.entries(dateJson)
      .filter(([current_asset]) => current_asset.includes(search_string) && current_asset.length > 8)
      .forEach(([current_asset, prices]) => {
        setListPayload(prevState => ({
        ...prevState,
        [current_asset]:prices
        }));
      }
      );

    }
    jsonSearch(fileString1)
    
  }

  return (
    <div>
        <input type='text' onChange={e => search(e.target.value)}/>
        <OperationsList listPayload={listPayload}/>
    </div>
  );
}

export default OperationPage;
