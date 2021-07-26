import React from "react";
import { OutOfStockPanel } from "./Panel";

export const OutOfStockList = ({ data }) => {
  var result = [];
  let rows = data.rows;

  rows.map((value, index, array) => {
    result.push(<OutOfStockPanel data={data} key={index} index={index} />);
    return value;
  });
  return <div className="mt-2 mb-5">{result}</div>;
};
