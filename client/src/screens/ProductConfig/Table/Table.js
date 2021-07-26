import React from "react";

import { columns } from "./columns";
import { echoFor } from "components";
import {
  useTable,
  useSortBy,
  useGroupBy,
  useExpanded,
  usePagination
} from "react-table";

import { Header } from "./Header";
import { Cell } from "./Cell";

export const Table = ({
  name,
  columns,
  rowsData,
  onRowClick,
  groupBy: customGroupBy
}) => {
  // let echo = echoFor(`Table - ${name}`);
  let echo = () => {};
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { groupBy, expanded }
  } = useTable(
    {
      columns,
      data: rowsData,
      initialState: {
        // groupBy: customGroupBy,
        expanded: ["product"]
      }
    },
    useGroupBy,
    useExpanded,
    useSortBy,
    usePagination
  );
  // Render the UI for your table
  echo("groupBy:", groupBy);
  echo("expanded:", expanded);
  return (
    <table
      {...getTableProps()}
      className="rounded border-collapse border border-gray-300 flex flex-col"
    >
      <thead className="table w-full border-b border-gray-300">
        <Header headerGroups={headerGroups} />
      </thead>
      <tbody className="block h-200 overflow-y-auto" {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          echo("Row este: ", row);
          var rowOnClick;
          if (row.canExpand) {
            rowOnClick = () => row.toggleExpanded();
          } else {
            rowOnClick = () => onRowClick(row);
          }

          return (
            prepareRow(row) || (
              <tr
                key={row.id}
                onClick={rowOnClick}
                {...row.getRowProps()}
                className={
                  "table w-full table-fixed bg-white even:bg-gray-100 text-gray-500 hover:bg-gray-100 p-2 cursor-pointer"
                }
              >
                {row.cells.map((cell, index) => {
                  // echo("Cell este: ", cell);
                  return (
                    <Cell
                      key={row.id + "-" + index}
                      row={row}
                      index={rowIndex}
                      cell={cell}
                    />
                  );
                })}
              </tr>
            )
          );
        })}
      </tbody>
    </table>
  );
};

export const ProductConfigTable = ({ rowsData, onRowClick }) => {
  let echo = echoFor("ProductConfigTable");
  return (
    <>
      <Table
        name="Settings"
        // groupBy={["location"]}
        columns={columns}
        rowsData={rowsData}
        onRowClick={rowIndex => {
          echo("Clicked row index is: ", rowIndex);
          var selection = window.getSelection();
          if (selection.type !== "Range" && onRowClick) onRowClick(rowIndex);
        }}
      />
    </>
  );
};
