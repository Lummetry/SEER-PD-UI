import { nimAPI } from "./api";
import { echo } from "components";

const getLocations = async () => {
  const locations = await nimAPI.post(`/query`, [`locations`]);
  // echo("Locations: ", locations.data);
  return locations.data;
};

const getLocationsForProducts = async products => {
  const locationsForProducts = await nimAPI.post(`/query`, [
    `locations-for-products`,
    {
      products: products
    }
  ]);
  return locationsForProducts.data;
};

export { getLocations, getLocationsForProducts };
