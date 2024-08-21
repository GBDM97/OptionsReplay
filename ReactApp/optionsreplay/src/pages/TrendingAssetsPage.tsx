import periods from "../data/trendingData.json";
import SelectComponent from "../components/SelectComponent";
import styled from "styled-components";
import SelectableAssetItem from "../components/SelectableAssetItem";
import { useState } from "react";

const TrendingAssetsPage: React.FC<{}> = ({}) => {
  const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: black;
  `;

  const TableHead = styled.thead`
    background-color: black;
    color: white;
    position: sticky;
    top: 0;
  `;

  const TableRow = styled.tr`
    color: white;
    &:nth-child(even) {
      background-color: #232323;
    }
  `;

  const TableHeaderCell = styled.th`
    padding: 12px;
    text-align: left;
    font-weight: 400;
  `;

  const TableCell = styled.td`
    padding: 12px;
  `;

  const [periodsArray, setPeriods] = useState<any>(periods);

  const [filteredAssets, setFiltered] = useState<Array<any>>([]);

  const filterAsset = (i: Array<any>) => {
    setFiltered((p) => [...p, i]);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableHeaderCell>Period</TableHeaderCell>
          <TableHeaderCell>Asset</TableHeaderCell>
          <TableHeaderCell>Underlying Price</TableHeaderCell>
          <TableHeaderCell>Strike</TableHeaderCell>
          <TableHeaderCell>Strike per Underlying Price</TableHeaderCell>
          <TableHeaderCell>Entry Open Price</TableHeaderCell>
          <TableHeaderCell>Exit Min Price</TableHeaderCell>
          <TableHeaderCell>Result</TableHeaderCell>
          <TableHeaderCell>Reverse Asset</TableHeaderCell>
          <TableHeaderCell>Reverse Entry Price</TableHeaderCell>
          <TableHeaderCell>Reverse Exit Price</TableHeaderCell>
          <TableHeaderCell>Reverse Result</TableHeaderCell>
          <TableHeaderCell>Trend Direction</TableHeaderCell>
          <button onClick={() => setPeriods(filteredAssets)}>Filter</button>
        </TableHead>
        <tbody>
          {periodsArray.map((asset: any) => (
            <TableRow>
              {asset.map((assetElement: any, index: number) =>
                index === 1 ? (
                  <TableCell>
                    <SelectableAssetItem
                      onClick={() => filterAsset(asset)}
                      asset={assetElement}
                    />
                  </TableCell>
                ) : (
                  <TableCell>{assetElement}</TableCell>
                )
              )}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TrendingAssetsPage;
