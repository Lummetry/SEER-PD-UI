const locationAggregated = params => {
  // echo("aggregated Location");
  const {
    cell: { value }
  } = params;
  return value === 1 ? `1 location` : `${value} locations`;
};

const countAggregate = (columnValues, rows) => {
  // echo("Count aggregate called");
  return columnValues.length;
};

// See https://github.com/tannerlinsley/react-table/blob/master/docs/api/useTable.md#column-options
export const columns = [
  {
    Header: "Product",
    accessor: "product",
    // accessor: (row) => {echo("Accesor pentru product: ", row); return Number(row.product)},
    id: "product",
    aggregate: [`count`, `count`], // This array is needed if we group by more than 1 column
    // Aggregated: productsAggregated,
    // groupByThis: true,
    maxWidth: 100,
    classes: {
      Header: "p-4 justify-start text-xs text-gray-600 w-1/2",
      Inside:
        "flex flex-row items-center text-xs text-gray-600 font-semibold uppercase"
    }
    // sortType: customSort
  },
  {
    Header: "Location",
    accessor: "location",
    // Treat location as number
    //accessor: (row) => {echo("Accesor pentru location: ", row); return Number(row.location)},
    id: "location",
    aggregate: countAggregate,
    Aggregated: locationAggregated,
    classes: {
      Header: "p-4 justify-start text-xs text-gray-600 w-1/2",
      Inside:
        "flex flex-row items-center text-xs text-gray-600 font-semibold uppercase"
    }
  },
  {
    Header: "Lead time",
    accessor: "leadTime"
  },
  {
    Header: "Initial stock",
    accessor: "initialStock"
  }
];
