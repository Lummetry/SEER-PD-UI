import { nimAPI } from "./api";

const getProducts = async () => {
  const products = await nimAPI.post(`/query`, [`products`]);
  return products.data;
};

const getProductsForLocations = async locations => {
  const productsForLocations = await nimAPI.post(`/query`, [
    `products-for-locations`,
    {
      locations: locations
    }
  ]);
  return productsForLocations.data;
};

export { getProductsForLocations, getProducts };
