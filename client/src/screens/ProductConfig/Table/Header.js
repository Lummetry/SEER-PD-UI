import React from "react";

import { echo } from "components";

import {
  PlusIcon,
  MinusIcon,
  LongArrowUpIcon,
  LongArrowDownIcon
} from "components/ui/Icons";

var merge = require("lodash.merge");

const headerCellClassName = `
  pt-3 pl-2 pb-3 
  bg-gray-100 
  border-b border-gray-400 
  text-right text-xs text-gray-600 font-semibold 
  uppercase 
  select-none
`;

const defaultClasses = {
  Header: "p-2 bg-gray-100 border-b border-gray-400",
  Caption: `justify-end w-full 
  flex flex- row items-center text - xs text - gray - 600 font - semibold uppercase`
};

export const Header = ({ headerGroups }) => {
  return headerGroups.map(headerGroup => (
    <tr className="w-full flex pr-4" {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map(column => {
        // echo("Column is: ", column);
        let classes = merge(defaultClasses, column.classes);
        return (
          <th
            {...column.getHeaderProps()}
            className={classes.Header}
            title="Click column to sort"
          >
            <div className={classes.Inside}>
              <div className="w-3 h-3 mr-1">
                {column.groupByThis ? (
                  <div {...column.getGroupByToggleProps()}>
                    {column.isGrouped ? <PlusIcon /> : <MinusIcon />}
                  </div>
                ) : null}
              </div>
              <div {...(column.canSort ? column.getSortByToggleProps() : null)}>
                {column.render("Header")}
              </div>
              <span
                {...(column.canSort ? column.getSortByToggleProps() : null)}
              >
                {column.canSort ? (
                  column.isSorted ? (
                    <div className="ml-1 w-2">
                      {column.isSortedDesc ? (
                        <LongArrowDownIcon />
                      ) : (
                        <LongArrowUpIcon />
                      )}
                    </div>
                  ) : (
                    <div className="ml-1 w-2"> </div>
                  )
                ) : null}
              </span>
            </div>
          </th>
        );
      })}
    </tr>
  ));
};
