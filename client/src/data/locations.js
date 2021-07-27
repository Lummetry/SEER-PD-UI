import { nimAPI } from "./api";
import axios from "axios";
import { echo } from "components";
import { SelectProductsModal } from "screens/SelectProducts/Modal";

const getLocationsPrev = async () => {
  const locations = await nimAPI.post(`/query`, [`locations`]);
  // echo("Locations: ", locations.data);
  return locations.data;
};

const getLocations = async () => {
  const response = await axios.get("api/site-item-mappings.json");
  const mappings = response.data;
  const locationsSet = new Set();
  mappings.forEach((row) => {
    locationsSet.add(row.location);
  });
  return Array.from(locationsSet);
}

const getLocationsForProducts = async (products) => {
  const response = await axios.get("api/site-item-mappings.json");
  const mappings = response.data;
  let result = [];
  let getAllProducts = (products.length == 1 && products[0] == -1);
  if (getAllProducts) {
    const locationsSet = new Set();
    mappings.forEach((row) => {
      locationsSet.add(row.location);
    });
    return Array.from(locationsSet);
  }
  products.forEach((product) => {
    mappings.forEach((row) => {
      if (row.product == product) result.push(row.location);
    });
  });
  return result;
};

export { getLocations, getLocationsForProducts };
