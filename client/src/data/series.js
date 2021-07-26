import { nimAPI, lensAPI } from "./api";

import { echo } from "components";

import axios from "axios";

const CancelToken = axios.CancelToken;
let source;

const getSeriesData = async (
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

  // const response = await lensAPI.post(location, {
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

  // echo("Response este: ", response.data);

  var responseData = null;
  echo("Tipul de response: ", typeof response.data);

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

const getBestBaselines = async (seriesIDs, startDateString, numSteps) => {
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

  echo("Best baselines response este: ", response.data);
  // echo("Inlocuim");
  const responseDataPatched = response.data.replace(/\b[Nn]a[Nn]\b/g, "null");
  var responseData = null;

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
  echo("Best baselines response filtrat este: ", responseData);
  return responseData.BENCHMARK.BEST_BASELINES;
};

const getSeriesForProductsAndLocations = async (products, locations) => {
  const series = await nimAPI.post(`/query`, [
    `series-for-products-and-locations`,
    {
      products,
      locations
    }
  ]);
  return series.data;
};

const getSeriesForProductsAndLocationsPromise = (products, locations) => {
  const promise = nimAPI.post(`/query`, [
    `series-for-products-and-locations`,
    {
      products,
      locations
    }
  ]);
  return promise;
};

export {
  getSeriesData,
  getBestBaselines,
  getSeriesForProductsAndLocations,
  getSeriesForProductsAndLocationsPromise
};
