import periods from "../data/data.json";
import SelectComponent from "../components/SelectComponent";
import styled from "styled-components";
import SelectableAssetItem from "../components/SelectableAssetItem";

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

  return (
    <Table>
      <TableHead>
        <TableHeaderCell>Period</TableHeaderCell>
        <TableHeaderCell>Asset</TableHeaderCell>
        <TableHeaderCell>Strike</TableHeaderCell>
        <TableHeaderCell>Entry Open Price</TableHeaderCell>
        <TableHeaderCell>Exit Min Price</TableHeaderCell>
        <TableHeaderCell>Result</TableHeaderCell>
        <TableHeaderCell>Reverse Asset</TableHeaderCell>
        <TableHeaderCell>Reverse Entry Price</TableHeaderCell>
        <TableHeaderCell>Reverse Exit Price</TableHeaderCell>
        <TableHeaderCell>Reverse Result</TableHeaderCell>
        <TableHeaderCell>Trend Direction</TableHeaderCell>
      </TableHead>
      <tbody>
        {periods
          .map((v) => v.data.trendingData)
          .flat()
          .map((asset) => (
            <TableRow>
              {asset.map((assetElement: any) => (
                <TableCell>{assetElement}</TableCell>
              ))}
            </TableRow>
          ))}
      </tbody>
    </Table>
  );
};

export default TrendingAssetsPage;
