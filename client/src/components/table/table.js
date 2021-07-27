import React from "react";
import { echo } from "components";
import { useTable, useSortBy, useGroupBy, useExpanded } from "react-table";
import { columns } from "./table-columns";

import { renderTableHeader } from "./table-header";
import { renderTableCell } from "./table-cell";

function Table({ columns, data, onRowClick }) {
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
      data,
      initialState: {
        groupBy: ["product"]
        // expanded: ["product:412"]
      }
    },
    useGroupBy,
    useExpanded,
    useSortBy
  );
  // Render the UI for your table
  echo("groupBy:", groupBy);
  echo("expanded:", expanded);
  return (
    <table
      {...getTableProps()}
      className="rounded shadow p-2 border-collapse w-full"
    >
      <thead>{renderTableHeader(headerGroups)}</thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          var rowOnClick;
          if (row.canExpand) {
            rowOnClick = () => row.toggleExpanded();
          } else {
            rowOnClick = () => onRowClick(row);
          }

          return (
            prepareRow(row) || (
              <tr
                onClick={rowOnClick}
                {...row.getRowProps()}
                className={
                  "bg-white even:bg-gray-100 text-gray-500 hover:bg-gray-100 p-2 cursor-pointer"
                }
              >
                {row.cells.map(cell => renderTableCell(row, rowIndex, cell))}
              </tr>
            )
          );
        })}
      </tbody>
    </table>
  );
}
