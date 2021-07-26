import React from "react";
import { plusIcon, minusIcon, chevronRight, chevronRight2, chevronDown } from "./table-mb-icons";

export const renderTableCell = (row, rowIndex, cell) => {
//   echo("Row este: ", row);
//   echo("Cell este: ", cell);
  return (
    <td
      className=""
      {...cell.getCellProps()}
    >
      <div className="text-right text-gray-600 pr-4 pt-2 pb-2">
      {cell.isGrouped ? (
        // If it's a grouped cell, add an expander and row count
        <div className="flex flex-row">
          <div className="w-3 ml-2 my-auto">
            {row.isExpanded ? (
              <div className="w-2">{chevronDown()}</div>
            ) : (
              <div className="w-2">{chevronRight2()}</div>
            )}
          </div>
          <div className="flex-grow">{cell.render("Cell")}</div>
          {/* ({row.subRows.length}) */}
        </div>
      ) : cell.isAggregated ? (
        // If the cell is aggregated, use the Aggregated
        // renderer for cell
        <div className="">{cell.render("Aggregated")}</div>
      ) : cell.isRepeatedValue ? null : ( // For cells with repeated values, render null
        // Otherwise, just render the regular cell
        cell.render("Cell")
      )}
      </div>
    </td>
  );
};
