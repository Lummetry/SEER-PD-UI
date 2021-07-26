import { nimAPI } from "./api";
import { echoFor, echo } from "components";
import { getSettings, saveSettings } from "./Settings";

export const getConfigsList = async () => {
  let echo = echoFor("listConfigs");
  const response = await nimAPI.get("/configs-list");
  echo("Response este: ", response.data);
  return response.data;
};

export const saveConfigs = async configsArray => {
  let echo = echoFor("saveConfigs");
  const response = await nimAPI.post("/configs-set", configsArray);
  echo("Response este: ", response.data);
  return response.data;
};

export const getConfigsListRows = configsListData => {
  let result = [];
  for (var productKey in configsListData) {
    let product = configsListData[productKey];
    for (var locationKey in product) {
      let location = product[locationKey];
      result.push({
        product: parseInt(productKey),
        location: parseInt(locationKey),
        ...location
      });
    }
  }
  return result;
};

export const addConfigsToSeries = async seriesArray => {
  let echo = echoFor("addConfigsToSeries");

  echo("seriesArray: ", seriesArray);

  let defaults = await getSettings([
    "default_lead_time",
    "default_initial_stock"
  ]);
  echo("defaults is: ", defaults);

  let default_lead_time = parseInt(defaults["default_lead_time"]);
  let default_initial_stock = parseInt(defaults["default_initial_stock"]);

  let configs = await getConfigsList();
  echo("configs is: ", configs);

  for (const [index, value] of seriesArray.entries()) {
    let { product, location } = value;
    if (configs[product] && configs[product][location]) {
      let { lead_time, initial_stock } = configs[product][location];
      value.leadTime = lead_time;
      value.initialStock = initial_stock;
    } else {
      value.leadTime = default_lead_time;
      value.initialStock = default_initial_stock;
    }
    // echo("value is: ", value);
  }
};

export const groupBySeries = seriesArray => {
  let result = {};
  for (const [index, value] of seriesArray.entries()) {
    // echo("Value is:", value);
    let { series, ...rest } = value;
    result[series] = rest;
  }
  return result;
};
