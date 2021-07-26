import { echoFor } from "components";
import { nimAPI } from "data/api";

export const getSeriesForLocationsAndProducts = async (
  selectedLocations,
  selectedProducts
) => {
  let echo = echoFor("getSeriesForLocationsAndProducts");
  let arrayToQuery = [];
  for (const [index, location] of selectedLocations.entries()) {
    let newItem = {};
    newItem.location = location;
    newItem.products = selectedProducts[location];
    arrayToQuery.push(newItem);
  }
  echo("arrayToQuery : ", arrayToQuery);
  const series = await nimAPI.post(`/query`, [
    `series-for-locations-and-products`,
    arrayToQuery,
    // `group-by-series`
    `group-by-none`
  ]);
  return series.data;
};
