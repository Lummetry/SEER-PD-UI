import { echoFor } from "components";

import {
  getSeriesData,
  getSeriesForProductsAndLocationsPromise,
  getRowsData
} from "data";

import moment from "moment";

const getPromisesForProductsAndLocations = (products, locations) => {
  let echo = echoFor("getPromisesForProductsAndLocation");
  let allPromises = [];
  products.forEach((selectedProduct, index) => {
    let selectedLocations = locations[selectedProduct];
    echo("Product: ", selectedProduct, " - locations: ", selectedLocations);
    const currentPromise = getSeriesForProductsAndLocationsPromise(
      [selectedProduct],
      selectedLocations
    );
    echo("Returned series: ", currentPromise);
    allPromises.push(currentPromise);
  });
  return allPromises;
};

const getPromisesForLocationsAndProducts = (locations, products) => {
  let echo = echoFor("getPromisesForLocationsAndProducts");
  let allPromises = [];
  locations.forEach((selectedLocation, index) => {
    let selectedProducts = products[selectedLocation];
    echo("Location: ", selectedLocation, " - products: ", selectedProducts);
    const currentPromise = getSeriesForProductsAndLocationsPromise(
      selectedProducts,
      [selectedLocation]
    );
    echo("Returned series: ", currentPromise);
    allPromises.push(currentPromise);
  });
  return allPromises;
};

export const getDemandPatternForProductsAndLocations = async ({
  products,
  locations,
  startDate,
  steps,
  historySize
}) => {
  let echo = echoFor("getDemandPatternForProductsAndLocations");

  let allPromises = getPromisesForProductsAndLocations(products, locations);

  let allSelectedSeries = [];
  await Promise.all(allPromises).then(function(values) {
    values.forEach(value => {
      allSelectedSeries.push(...value.data);
    });
  });

  echo("All series: ", allSelectedSeries);
  let series = allSelectedSeries.map(x => x.series);

  echo("Series: ", series);
  echo("History size: ", historySize);

  const seriesData = await getSeriesData(
    series,
    moment(startDate).format(`YYYY-MM-DD`),
    steps,
    historySize
  );
  // const seriesData = sampleResponse;
  echo("Series data: ", seriesData);
  let rowsData = getRowsData(
    series,
    seriesData,
    allSelectedSeries,
    steps,
    startDate,
    historySize
  );
  echo("Rows data: ", rowsData);

  return { rowsData, seriesData };
};

export const getDemandPatternForLocationsAndProducts = async ({
  locations,
  products,
  startDate,
  steps,
  historySize
}) => {
  let echo = echoFor("getDemandPatternForLocationsAndProducts");

  let allPromises = getPromisesForLocationsAndProducts(locations, products);

  let allSelectedSeries = [];
  await Promise.all(allPromises).then(function(values) {
    values.forEach(value => {
      allSelectedSeries.push(...value.data);
    });
  });

  echo("All series: ", allSelectedSeries);
  let series = allSelectedSeries.map(x => x.series);

  echo("Series: ", series);
  echo("History size: ", historySize);

  const seriesData = await getSeriesData(
    series,
    moment(startDate).format(`YYYY-MM-DD`),
    steps,
    historySize
  );
  // const seriesData = sampleResponse;
  echo("Series data: ", seriesData);
  let rowsData = getRowsData(
    series,
    seriesData,
    allSelectedSeries,
    steps,
    startDate,
    historySize
  );
  echo("Rows data: ", rowsData);

  return { rowsData, seriesData };
};
