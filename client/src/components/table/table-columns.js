import React from "react";
import { echo } from "components";
import { customSort } from "./table-sort";

const countAggregate = (columnValues, rows) => {
  echo("Count aggregate called");
  return columnValues.length;
};

const roundValue = (value, suffix, color) => (
  <div className="items-right">
    {suffix}
    <div
      // border
      className={`ml-2 inline-block rounded w-10 text-center text-xs font-semibold 

     ${color}`}
    >{`${value * 100} %`}</div>
  </div>
);

const greenValue = (value, suffix) =>
  roundValue(
    value,
    suffix,
    // border-green-500
    "bg-green-200 text-green-800"
  );

const yellowValue = (value, suffix) =>
  roundValue(
    value,
    suffix,
    // border-yellow-600
    "bg-yellow-400 text-yellow-800"
  );
const orangeValue = (value, suffix) =>
  roundValue(
    value,
    suffix,
    // border-orange-600
    "bg-orange-400 text-orange-900"
  );
const redValue = (value, suffix) =>
  roundValue(value, suffix, "border-red-500- bg-red-300 text-red-900");

const renderValue = (value, suffix) => {
  if (value < 0.25) {
    return redValue(value, suffix);
  } else if (value < 0.5) {
    return orangeValue(value, suffix);
  } else if (value < 0.75) {
    return yellowValue(value, suffix);
  } else if (value <= 1.0) {
    return greenValue(value, suffix);
  }
};

const renderConfidenceLevel = params => {
  // echo(params);
  return <>{renderValue(params.cell.value)}</>;
};

const renderNumericColumn = params => {
  return <>{params.cell.value}</>;
};

export const columns = [
  {
    Header: "Location",
    accessor: "location",
    // Treat location as number
    //accessor: (row) => {echo("Accesor pentru location: ", row); return Number(row.location)},
    id: "location",
    aggregate: countAggregate,
    Aggregated: params => {
      const {
        cell: { value }
      } = params;
      return `${value} locations`;
    },
    sortType: customSort
  },
  {
    Header: "Product",
    accessor: "product",
    // accessor: (row) => {echo("Accesor pentru product: ", row); return Number(row.product)},
    id: "product",
    aggregate: [`count`],
    Aggregated: ({ cell: { value } }) =>
      value === 1 ? `1 product` : `${value} products`,
    groupByThis: true,
    sortType: customSort
  },
  {
    Header: "Predicted demand",
    accessor: "predictedDemand",
    columnDisableGrouping: true,
    disableGrouping: true,
    aggregate: "sum",
    Aggregated: ({ cell: { value } }) => `${value} (total)`,
    sortType: customSort
  },
  {
    Header: "Real demand",
    accessor: "realDemand",
    columnDisableGrouping: true,
    disableGrouping: true,
    aggregate: "sum",
    Aggregated: ({ cell: { value } }) => `${value} (total)`,
    Cell: renderNumericColumn,
    sortType: customSort
  },
  {
    Header: "Confidence level",
    accessor: "confidence",
    columnDisableGrouping: true,
    disableGrouping: true,
    Cell: renderConfidenceLevel,
    aggregate: "average",
    Aggregated: ({ cell: { value } }) => renderValue(value, "avg"),
    sortType: customSort
  }
];
