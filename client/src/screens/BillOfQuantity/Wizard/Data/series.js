import { echoFor } from "components";
import { nimAPI } from "data/api";
import axios from "axios";

const getSeriesForLocationsAndProductsFromJson = async (arrayToQuery) =>{
  const response = await axios.get("api/site-item-mappings.json");
  const mappings = response.data;
  let result = [];
  for (const item of arrayToQuery) {
    let getAllProducts = (item.products.length == 1 && item.products[0] == -1);
    for (const row of mappings) {
      if (row.location == item.location) {
        if (getAllProducts) {
          result.push(row.series);
        } else {
          if (item.products.includes(row.product)) result.push(row.series);
        }      
      }
    }
  }
  return result;
}

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
  /*const series = await nimAPI.post(`/query`, [
    `series-for-locations-and-products`,
    arrayToQuery,
    // `group-by-series`
    `group-by-none`
  ]);
  return series.data*/
  const series = await getSeriesForLocationsAndProductsFromJson(arrayToQuery);
  return series;
};
