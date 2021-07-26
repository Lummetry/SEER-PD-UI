import React from "react";
import { echo } from "components";
import moment from "moment";

const countAggregate = (columnValues, rows) => {
  // echo("Count aggregate called");
  return columnValues.length;
};

const locationAggregated = params => {
  // echo("aggregated Location");
  const {
    cell: { value }
  } = params;
  return value === 1 ? `1 location` : `${value} locations`;
};

const productsAggregated = ({ cell: { value } }) =>
  value === 1 ? `1 product` : `${value} products`;

const renderPlaceOrderOn = params => {
  // echo("renderPlaceOrderOn - params: ", params);
  // echo(params);
  let startDate = moment(params.row.original.data.startDate);
  let thisDay = startDate.add(params.cell.value, "days").format("D MMM YYYY");
  // echo("renderPlaceOrderOn - thisDay: ", thisDay);
  return <>{thisDay}</>;
};

const renderNumericColumn = params => {
  return <>{params.cell.value}</>;
};

const outOfStockAggregate = (cells, rows, isAggregated) => {
  // echo("aggregate orderSize");
  let numIsOutOfStock = 0;
  rows.forEach((value, index) => {
    if (value.original) {
      if (value.original.isOutOfStock === true) {
        numIsOutOfStock += 1;
      }
    } else {
      echo("Value este: ", value);
    }
  });

  let result = `${numIsOutOfStock} out of ${rows.length}`;
  return result;
};

const outOfStockAggregated = params => {
  let {
    cell: { value }
  } = params;
  // echo("Aggregated: ", params, " - Value: ", value);
  return `${value}`;
};
const placeOrderInAggregate = (cells, rows, isAggregated) => {
  // echo("placeOrderIn aggregate rows: ", rows);
  let rowsArray = rows[0].isAggregated ? rows[0].subRows[0] : rows[0];
  let minValue = rowsArray.original.placeOrderIn;
  rows.forEach((value, index) => {
    let valueToCheck = value.isAggregated ? value.subRows[0] : value;
    if (
      valueToCheck.original.isOutOfStock === true &&
      valueToCheck.original.placeOrderIn < minValue
    ) {
      minValue = valueToCheck.original.placeOrderIn;
    }
  });
  let startDate = moment(rowsArray.original.data.startDate);
  let thisDay = startDate.add(minValue, "days").format("D MMM YYYY");

  let result = `${thisDay}`;
  return result;
};

const placeOrderInAggregated = params => {
  let {
    cell: { value }
  } = params;
  // echo("Aggregated: ", params, " - Value: ", value);
  return `${value}`;
};

export const columns = [
  {
    Header: "Location",
    accessor: "location",
    // Treat location as number
    //accessor: (row) => {echo("Accesor pentru location: ", row); return Number(row.location)},
    id: "location",
    aggregate: countAggregate,
    Aggregated: locationAggregated,
    groupByThis: true
    // sortType: customSort
  },
  {
    Header: "Product",
    accessor: "product",
    // accessor: (row) => {echo("Accesor pentru product: ", row); return Number(row.product)},
    id: "product",
    aggregate: [`count`, `count`], // This array is needed if we group by more than 1 column
    Aggregated: productsAggregated,
    groupByThis: true
    // sortType: customSort
  },
  {
    Header: "Will be out of stock",
    accessor: row => {
      // echo("accesor pentru out of stock: ", row);
      return row.isOutOfStock ? <p>Yes</p> : <p>No</p>;
    },
    columnDisableGrouping: true,
    disableGrouping: true,
    aggregate: outOfStockAggregate,
    Aggregated: outOfStockAggregated,
    Cell: renderNumericColumn
    // sortType: customSort
  },
  {
    Header: "Place order on",
    accessor: "placeOrderIn",
    columnDisableGrouping: true,
    disableGrouping: true,
    Cell: renderPlaceOrderOn,
    aggregate: [placeOrderInAggregate, placeOrderInAggregate],
    Aggregated: placeOrderInAggregated
    // sortType: customSort
  },
  {
    Header: "Required Order Size",
    accessor: "orderSize",
    columnDisableGrouping: true,
    disableGrouping: true,
    aggregate: "sum",
    Aggregated: ({ cell: { value } }) => `${value} (total)`
    // sortType: customSort
  }
];
