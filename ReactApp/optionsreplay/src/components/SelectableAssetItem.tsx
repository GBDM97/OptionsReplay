import React, { Dispatch, SetStateAction, useState } from "react";
import "../App.css";

const SelectableAssetItem: React.FC<{
  asset: string;
  selected: boolean;
  onChange: Function;
}> = ({ asset, selected, onChange }) => {
  return (
    <div
      className="hover-effect"
      style={{ backgroundColor: selected ? "#00AAFF" : "black" }}
      onClick={() => onChange(asset)}
    >
      {asset}
    </div>
  );
};

export default SelectableAssetItem;
