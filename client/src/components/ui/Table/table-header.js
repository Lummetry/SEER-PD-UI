import React from "react";
import { plusIcon, minusIcon, longArrowDown, longArrowUp } from "./table-icons";

const headerCellClassName = `
  pt-3 pl-2 pb-3 
  bg-gray-100 
  border-b border-gray-400 
  text-right text-xs text-gray-600 font-semibold 
  uppercase 
  select-none
`;

export const renderTableHeader = headerGroups => {
  return headerGroups.map(headerGroup => (
    <tr {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map(column => {
        // echo("Column is: ", column);
        return (
          <th
            {...column.getHeaderProps()}
            className={headerCellClassName}
            title="Click column to sort"
          >
            <div className="flex flex-row items-center pr-2 justify-space-between">
              {column.groupByThis ? (
                // If the column can be grouped, let's add a toggle
                <div
                  {...column.getGroupByToggleProps()}
                  className="w-3 h-3 mr-1"
                  title={
                    column.isGrouped
                      ? "Click to ungroup"
                      : `Group by ${column.id}`
                  }
                >
                  {column.isGrouped ? plusIcon() : minusIcon()}
                </div>
              ) : null}
              <div className="justify-end w-full flex flex-row items-center">
                <div
                  {...(column.canSort ? column.getSortByToggleProps() : null)}
                >
                  {column.render("Header")}
                </div>
                <span
                  {...(column.canSort ? column.getSortByToggleProps() : null)}
                >
                  {column.canSort ? (
                    column.isSorted ? (
                      <div className="ml-1 w-2">
                        {column.isSortedDesc ? (
                          <>{longArrowDown()}</>
                        ) : (
                          <>{longArrowUp()}</>
                        )}
                      </div>
                    ) : (
                      <div className="ml-1 w-2"> </div>
                    )
                  ) : null}
                </span>
              </div>
            </div>
          </th>
        );
      })}
    </tr>
  ));
};
