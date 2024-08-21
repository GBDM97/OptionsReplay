import React, { Dispatch, SetStateAction, useState } from "react";
import "../App.css";
import { AssetInfo } from "../pages/OperationPage";
import SelectableAssetItem from "./SelectableAssetItem";
import styled from "styled-components";

const OperationsList: React.FC<{
  listPayload: AssetInfo;
}> = ({ listPayload }) => {
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
        {Object.entries(listPayload).map(([asset, prices]) => (
          <TableRow>
            <TableCell>
              <SelectableAssetItem asset={asset} onClick={() => console} />
            </TableCell>
            {prices.length === 6
              ? prices.splice(
                  3,
                  0,
                  String((Number(prices[2]) - Number(prices[1])).toFixed(2))
                )
              : null}
            {prices.length === 7
              ? prices.splice(
                  7,
                  0,
                  String((Number(prices[6]) - Number(prices[5])).toFixed(2))
                )
              : null}
            {prices.map((v, i) => (
              <TableCell
                style={{
                  color:
                    i === 3 || i === 7
                      ? Number(v) < 0
                        ? "red"
                        : "lime"
                      : "white",
                }}
              >
                {v}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default OperationsList;
