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
      </TableHead>
      <tbody>
        {Object.entries(listPayload).map(([asset, prices]) => (
          <TableRow>
            <TableCell>
              <SelectableAssetItem asset={asset} />
            </TableCell>
            {prices.map((p) => (
              <TableCell>{p}</TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default OperationsList;
