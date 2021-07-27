import React from "react";
import { echo } from "components";
import { ChevronDownIcon, ChevronRightIcon } from "components/ui/Icons";

export const Cell = ({ row, index: rowIndex, cell }) => {
  return (
    <td className="p-4" {...cell.getCellProps()}>
      <div className="flex flex-row items-center">
        <div className="w-3 h-3 flex items-center justify-center mr-1">
          <div className="w-2 h-2">
            {cell.isGrouped ? (
              row.isExpanded ? (
                <ChevronDownIcon />
              ) : (
                <ChevronRightIcon />
              )
            ) : null}
          </div>
        </div>
        <div className="text-left text-gray-600 pt-2 pb-2">
          {cell.isAggregated ? cell.render("Aggregated") : cell.render("Cell")}
        </div>
      </div>
    </td>
  );
};
