import React, { Dispatch, SetStateAction, useState } from "react";
import "../App.css";
import { AssetInfo } from "../pages/OperationPage";
import SelectableAssetItem from "./SelectableAssetItem";

const OperationsList: React.FC<{
  listPayload: AssetInfo;
  selectedOperation: string;
  setSelectedOperation: Function;
}> = ({ listPayload, selectedOperation, setSelectedOperation }) => {
  return (
    <div>
      {Object.entries(listPayload).map(([asset, prices]) => (
        <>
          <SelectableAssetItem
            asset={asset}
            selected={asset === selectedOperation}
            onChange={setSelectedOperation}
          />
          <p>
            {prices.map((p) => (
              <span style={{ margin: "5px" }}>{p}</span>
            ))}
          </p>
        </>
      ))}
    </div>
  );
};

export default OperationsList;
