import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "../App.css";
import styled from "styled-components";
import data from "../data/data.json";
import OperationsList from "../components/OperationsList";

export type AssetInfo = {
  [key: string]: string[];
};

const OperationPage: React.FC<{ index: number }> = ({ index }) => {
  const [entryInfo, setEntryInfo] = useState<AssetInfo>({});
  const [exitInfo, setExitInfo] = useState<AssetInfo>({});
  const [selectedOperation, setSelectedOperation] = useState("");

  const indexToData = () => {
    return { entry: data.D24062024, exit: data.D28062024 };
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
      return Object.entries(dateJson).filter(
        ([current_asset]) =>
          current_asset.includes(search_string) && current_asset.length > 8
      );
    };
    if (isEntry) {
      setEntryInfo({});
      jsonSearch(jsonInput1).forEach(([current_asset, prices]) => {
        setEntryInfo((prevState) => ({
          ...prevState,
          [current_asset]: prices,
        }));
      });
    } else {
      const res = jsonSearch(jsonInput2).slice(-1)[0];
      setExitInfo(res ? { [res[0]]: res[1] } : {});
    }
  };

  useEffect(() => {
    search(selectedOperation, false);
  }, [selectedOperation]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "50%" }}>
          <input type="text" onChange={(e) => search(e.target.value, true)} />
          <OperationsList
            listPayload={entryInfo}
            selectedOperation={selectedOperation}
            setSelectedOperation={setSelectedOperation}
          />
        </div>
        <div>{JSON.stringify(exitInfo)}</div>
      </div>
    </>
  );
};

export default OperationPage;
