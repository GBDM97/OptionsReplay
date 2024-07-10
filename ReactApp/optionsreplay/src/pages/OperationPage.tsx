import { useState } from "react";
import "../App.css";
import data from "../data/data.json";
import OperationsList from "../components/OperationsList";

export type AssetInfo = {
  [key: string]: string[];
};

const OperationPage = () => {
  const [dateIndex, setDateIndex] = useState<number>();
  const [list, setList] = useState<AssetInfo>({});

  const indexToData = () => {
    if (dateIndex === 1) {
      return { entry: data.D24062024, exit: data.D28062024 };
    } else {
      return { entry: data.D24062024, exit: data.D28062024 };
    }
  };

  const search = (search_string: string, isEntry: boolean) => {
    if (search_string === "") {
      setList({});
      return;
    }
    const selectedData = indexToData();
    const jsonInput1: AssetInfo = selectedData.entry;
    const jsonInput2: AssetInfo = selectedData.exit;

    const jsonSearch = (
      dateJson: { [key: string]: string[] },
      includes: boolean,
      list_asset?: string
    ) => {
      return Object.entries(dateJson).filter(([current_asset]) =>
        includes
          ? current_asset.includes(search_string)
          : current_asset === list_asset
      );
    };
    setList({});
    jsonSearch(jsonInput1, true).forEach(([current_asset, prices]) => {
      const exitInfo = jsonSearch(jsonInput2, false, current_asset);
      console.log(exitInfo);
      setList((previous) => ({
        ...previous,
        [current_asset]: [
          prices[0],
          prices[1],
          exitInfo && exitInfo[0] ? exitInfo[0][1][3] : "",
        ],
      }));
    });
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
          <OperationsList listPayload={list} />
        </div>
      </div>
    </>
  );
};

export default OperationPage;
