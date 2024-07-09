import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "../App.css";
import styled from "styled-components";
import data from "../data/data.json";
import OperationsList from "../components/OperationsList";

export type AssetInfo = {
  [key: string]: string[];
};

const OperationPage = () => {
  const [dateIndex, setDateIndex] = useState<number>();
  const [entryInfo, setEntryInfo] = useState<AssetInfo>({});
  const [exitInfo, setExitInfo] = useState<AssetInfo>({});

  const indexToData = () => {
    if (dateIndex === 1) {
      return { entry: data.D24062024, exit: data.D28062024 };
    } else {
      return { entry: data.D24062024, exit: data.D28062024 };
    }
  };

  const search = (search_string: string, isEntry: boolean) => {
    if (search_string === "") {
      setEntryInfo({});
      return;
    }
    const selectedData = indexToData();
    const jsonInput1: AssetInfo = selectedData.entry;
    const jsonInput2: AssetInfo = selectedData.exit;

    const jsonSearch = (dateJson: { [key: string]: string[] }) => {
      return Object.entries(dateJson).filter(([current_asset]) =>
        current_asset.includes(search_string)
      );
    };
    if (isEntry) {
      setEntryInfo({});
      jsonSearch(jsonInput1).forEach(([current_asset, prices]) => {
        setEntryInfo((prevState) => ({
          ...prevState,
          [current_asset]: [prices[0], prices[1]],
        }));
      });
    } else {
      const res = jsonSearch(jsonInput2).slice(-1)[0];
      setExitInfo(res ? { [res[0]]: res[1] } : {});
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "50%" }}>
          <input type="checkbox" onClick={() => setDateIndex(1)} />
          {"24 / 06 - 28 / 06 (FR W4)"}
          <br />
          <br />
          <input type="text" onChange={(e) => search(e.target.value, true)} />
          <OperationsList listPayload={entryInfo} />
        </div>
      </div>
    </>
  );
};

export default OperationPage;
