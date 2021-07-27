import { nimAPI, lensAPI } from "./api";

import { echo } from "components";

import axios from "axios";

let source;

const repairJSON = (input) => {
  if (typeof input === "object") {
    return input;
  }

  const inputPatched = input.replace(/\b[Nn]a[Nn]\b/g, "null");
  var output;

  try {
    output = JSON.parse(inputPatched);
  } catch (e) {
    echo("Error when parsing JSON: ", e);
  }
  return output;
}

const getSeriesDataPrev = async (
  seriesIDs,
  startDateString,
  numSteps,
  historySize
) => {
  if (seriesIDs === "") {
    echo("Don't have a seriesIDs yet");
    return;
  }

  if (source) {
    source.cancel();
  }

  var cached = false;
  var seriesIDsNumeric = seriesIDs.map(value => parseInt(value));

  var location = cached === true ? `/analyze2` : `/analyze`;

  const response = await lensAPI.post(location, {
    DATASET_HANDLE: "?",
    MODEL: "baselines",
    ID: cached ? seriesIDs : seriesIDsNumeric,
    START_DATE: startDateString,
    Y_PAST: historySize ? historySize : 10,
    // Y_PAST: 100,
    RETURN_Y_TEST: 1,
    BENCHMARK: 1,
    STEPS: numSteps
  });

  var responseData = null;

  if (typeof response.data === "object") {
    return response.data;
  }

  const responseDataPatched = response.data.replace(/\b[Nn]a[Nn]\b/g, "null");
  var responseData;

  try {
    responseData = JSON.parse(responseDataPatched);
    // eslint-disable-next-line no-eval
    //responseData = eval(responseDataPatched);
  } catch (e) {
    echo("Error when parsing JSON: ", e);
    // You can read e for more info
    // Let's assume the error is that we already have parsed the payload
    // So just return that
    responseData = responseDataPatched;
  }
  // echo("Noul response:");
  // echo(responseData);
  return responseData;
};

const getSeriesData = async (
  seriesIDs,
  startDateString,
  numSteps,
  historySize
) => {  
    const response = await axios.get(`api/lens_ui_response.json`);
    const result = repairJSON(response.data);    
    return result;
}

const getBestBaselinesPrev = async (seriesIDs, startDateString, numSteps) => {
  if (seriesIDs === "") {
    echo("Don't have a seriesIDs yet");
    return;
  }
  var seriesIDsNumeric = seriesIDs.map(value => parseInt(value));

  var location = "/analyze";

  const response = await lensAPI.post(location, {
    DATASET_HANDLE: "?",
    MODEL: "baselines",
    ID: seriesIDsNumeric,
    START_DATE: startDateString,
    // Y_PAST: 100,
    RETURN_Y_TEST: 1,
    BENCHMARK: 1,
    STEPS: numSteps
  });

  const responseDataPatched = response.data.replace(/\b[Nn]a[Nn]\b/g, "null");
  var responseData = null;

  try {
    responseData = JSON.parse(responseDataPatched);
  } catch (e) {
    echo("Error when parsing JSON: ", e);
    responseData = responseDataPatched;
  }
  return responseData.BENCHMARK.BEST_BASELINES;
};

const getBestBaselines = async (seriesIDs, startDateString, numSteps) => {
  const response = await axios.get(`api/lens_ui_response.json`);
  const result = repairJSON(response.data);    
  return result.BENCHMARK.BEST_BASELINES;  
}


const getSeriesForProductsAndLocations = async (products, locations) => {
  const response = await axios.get("api/site-item-mappings.json");
  const mappings = response.data;
  let getAllProducts = (products.length == 1 && products[0] == -1);
  let getAllLocations = (locations.length == 1 && locations[0] == -1);

  let result = {};

  if (getAllProducts && getAllLocations){
    result.data = mappings;
    return result;
  }

  let selectedMappings = [];

  if (getAllProducts){
    mappings.forEach((row)=>{
      locations.forEach((location)=>{
        if (location == row.location) selectedMappings.push(row);
      })
    })
    result.data = selectedMappings;
  }
  if (getAllLocations){
    mappings.forEach((row)=>{
      products.forEach((product)=>{
        if (product == row.product) selectedMappings.push(row);
      })
    })
    result.data = selectedMappings;
  }
  return result;
};

const getSeriesForProductsAndLocationsPromise = (products, locations) => {
  /*const promise = nimAPI.post(`/query`, [
    `series-for-products-and-locations`,
    {
      products,
      locations
    }
  ]);   
  return promise;*/
  return getSeriesForProductsAndLocations(products, locations);
  
};

export {
  getSeriesData,
  getBestBaselines,  
  getSeriesForProductsAndLocationsPromise
};
