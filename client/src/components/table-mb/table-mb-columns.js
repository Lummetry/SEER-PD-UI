import React from "react";
import { customSort } from "./table-mb-sort";
import { echo } from "components";
var sprintf = require("sprintf-js").sprintf;

const countAggregate = (columnValues, rows) => {
  echo("Count aggregate called");
  return columnValues.length;
};

const roundValue = (value, suffix, color) => {
  // const roundedValue = value != null ? parseFloat(Math.round(value * 100)) : 0;
  const floatValue = parseFloat(Math.round(value * 100));
  const roundedValue =
    value !== null && floatValue !== 0 ? sprintf(`%.0f`, floatValue) : 0;
  const displayedValue = roundedValue !== 0 ? roundedValue + " %" : 0;
  return (
    <div className="items-right">
      {suffix}
      <div
        // border
        className={`ml-2 inline-block rounded w-10 text-center text-xs font-semibold 

     ${color}`}
        title={value}
      >{`${displayedValue}`}</div>
    </div>
  );
};

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
const redValue = (value, suffix) => {
  return roundValue(value, suffix, "border-red-500- bg-red-300 text-red-900");
};

const renderValue = (value, suffix) => {
  if (value <= 0 || value == null) return roundValue(0);
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
    Header: "Model",
    accessor: "model",
    id: "model",
    sortType: customSort
  },
  {
    Header: "PQI",
    accessor: "PQI_33",
    id: "PQI_33",
    Cell: renderConfidenceLevel,
    title: "Total % good pred over real imp ser",
    sortType: customSort
  },
  {
    Header: "G&I_33",
    accessor: "G&I_33",
    id: "G&I_33",
    Cell: renderConfidenceLevel,
    sortType: customSort
  },
  {
    Header: "PGA_33",
    title: "Total 33% good pred of all series",
    accessor: "PGA_33",
    id: "PGA_33",
    Cell: renderConfidenceLevel,
    sortType: customSort
  },
  {
    Header: "GOOD_33",
    accessor: "GOOD_33",
    id: "GOOD_33",
    Cell: renderConfidenceLevel,
    sortType: customSort
  },
  {
    Header: "GQ",
    accessor: "GQ_33",
    id: "GQ_33",
    Cell: renderConfidenceLevel,
    sortType: customSort,
    title: "Total % good pred over own targets"
  },
  {
    Header: "OVL_PC",
    accessor: "OVL_PC",
    id: "OVL_PC",
    Cell: renderConfidenceLevel,
    sortType: customSort,
    title: "Overall total % pred over real (both bad/good)"
  },

  {
    Header: "OVL_OT",
    accessor: "OVL_OT",
    id: "OVL_OT",
    Cell: renderConfidenceLevel,
    sortType: customSort
  },
  {
    Header: "WOT_33",
    accessor: "WOT_33",
    id: "WOT_33",
    Cell: renderConfidenceLevel,
    sortType: customSort
  },
  {
    Header: "AC%_33",
    accessor: "AC%_33",
    id: "AC%_33",
    Cell: renderConfidenceLevel,
    sortType: customSort
  }
];
