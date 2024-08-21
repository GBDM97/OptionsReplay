import React, { Dispatch, SetStateAction, useState } from "react";
import "../App.css";

const SelectableAssetItem: React.FC<{ asset: string; onClick: Function }> = ({
  asset,
  onClick,
}) => {
  const [selected, setSelected] = useState(false);
  return (
    <div
      className="hover-effect"
      onClick={() => {
        setSelected((p) => !p);
        onClick();
      }}
      style={selected ? { borderColor: "white", cursor: "pointer" } : {}}
    >
      {asset}
    </div>
  );
};

export default SelectableAssetItem;
