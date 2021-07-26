import React from "react";

import { Table } from "components/ui/Table";
import { columns } from "./columns";
import { echo } from "components";

export const OutOfStockTable = ({ data, onRowClick }) => {
  return (
    <>
      <Table
        groupBy={["location"]}
        columns={columns}
        data={data.rows}
        onRowClick={rowIndex => {
          echo("Clicked row index is: ", rowIndex);
          var selection = window.getSelection();
          if (selection.type !== "Range" && onRowClick) onRowClick(rowIndex);
        }}
      />
    </>
  );
};
