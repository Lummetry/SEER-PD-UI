import React from "react";
import { Table } from "components/ui/Table";
import { columns } from "./columns";
import { echo } from "components";

export const LensTable = ({ data, onRowClick, groupBy }) => {
  return (
    <>
      <Table
        // groupBy={groupBy ? groupBy : ["product"]}
        groupBy={[]}
        columns={columns}
        data={data}
        onRowClick={rowIndex => {
          echo("Clicked row index is: ", rowIndex);
          var selection = window.getSelection();
          if (selection.type !== "Range" && onRowClick) onRowClick(rowIndex);
        }}
      />
    </>
  );
};
