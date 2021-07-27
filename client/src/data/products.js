import axios from "axios";
import { nimAPI } from "./api";

const getProductsPrev = async () => {
  const products = await nimAPI.post(`/query`, [`products`]);
  return products.data;
};

const getProducts = async () => {
  const response = await axios.get("api/site-item-mappings.json");
  const mappings = response.data;
  const productsSet = new Set();
  mappings.forEach((row) => {
    productsSet.add(row.product);
  });
  return Array.from(productsSet);
}

const getProductsForLocationsPrev = async locations => {
  const productsForLocations = await nimAPI.post(`/query`, [
    `products-for-locations`,
    {
      locations: locations
    }
  ]);
  return productsForLocations.data;
};

const getProductsForLocations = async locations => {
  const response = await axios.get("api/site-item-mappings.json");
  const mappings = response.data;
  const productsSet = new Set();
  locations.forEach((location)=>{
    mappings.forEach((row)=>{
      if (row.location == location) productsSet.add(row.product);
    })
  });
  return Array.from(productsSet);
}

export { getProductsForLocations, getProducts };
