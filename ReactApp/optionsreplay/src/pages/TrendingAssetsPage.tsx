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

  const dataExample = [
    {
      data: {
        ABEVG110W4: [1, 2, 3, 4, 5, 6],
        VALER120W5: [1, 2, 3, 4, 5, 6],
        GGBRR670W3: [7, 6, 5, 4, 3, 2],
      },
      dates: "",
      trendingAssets: { abev3: "up", ggbr4: "down" },
    },
  ];
  return (
    <Table>
      <TableHead>
        <TableHeaderCell />
        <TableHeaderCell>Strike</TableHeaderCell>
        <TableHeaderCell>Entry Open Price</TableHeaderCell>
        <TableHeaderCell>Exit Min Price</TableHeaderCell>
        <TableHeaderCell>Result</TableHeaderCell>
        <TableHeaderCell>Reverse Asset</TableHeaderCell>
        <TableHeaderCell>Reverse Entry Price</TableHeaderCell>
        <TableHeaderCell>Reverse Exit Price</TableHeaderCell>
        <TableHeaderCell>Reverse Result</TableHeaderCell>
      </TableHead>
      <tbody>
        {periods.map((period) =>
          Object.entries(period.data.trendingData).map((data) => <p>{data}</p>)
        )}
      </tbody>
    </Table>
  );
};

export default TrendingAssetsPage;
