import { nimAPI } from "./api";
import { echoFor, echo } from "components";
import { getSettings, saveSettings } from "./Settings";

export const getConfigsList = async () => {
  let echo = echoFor("listConfigs");
  //const response = await nimAPI.get("/configs-list");
  //return response.data;
  return {
    "1": {
      "1": { lead_time: 1, initial_stock: 1 },
      "-1": { lead_time: 1, initial_stock: 1 },
    },
    "2": { "2": { lead_time: 2, initial_stock: 2 } },
    "402": { "0": { lead_time: 1, initial_stock: 33 } },
    "412": { "0": { lead_time: 1, initial_stock: 24 } },
    "3878": { "0": { lead_time: 4, initial_stock: 30 } },
  };
};

export const saveConfigs = async (configsArray) => {
  let echo = echoFor("saveConfigs");
  const response = await nimAPI.post("/configs-set", configsArray);
  return response.data;
};

export const getConfigsListRows = (configsListData) => {
  let result = [];
  for (var productKey in configsListData) {
    let product = configsListData[productKey];
    for (var locationKey in product) {
      let location = product[locationKey];
      result.push({
        product: parseInt(productKey),
        location: parseInt(locationKey),
        ...location,
      });
    }
  }
  return result;
};

export const addConfigsToSeries = async (seriesArray) => {
  let echo = echoFor("addConfigsToSeries");

  echo("seriesArray: ", seriesArray);

  /*let defaults = await getSettings([
    "default_lead_time",
    "default_initial_stock"
  ]);*/

  let defaults = {
    default_lead_time: 1,
    default_initial_stock: 20,
  };
  echo("defaults is: ", defaults);

  let default_lead_time = parseInt(defaults["default_lead_time"]);
  let default_initial_stock = parseInt(defaults["default_initial_stock"]);

  let configs = await getConfigsList();
  echo("configs is: ", configs);

  for (const [index, value] of seriesArray.entries()) {
    let { product, location } = value;
    /*
    TODO: check this
    if (configs[product] && configs[product][location]) {
      
      let { lead_time, initial_stock } = configs[product][location];
      value.leadTime = lead_time;
      value.initialStock = initial_stock;
    } else {
      value.leadTime = default_lead_time;
      value.initialStock = default_initial_stock;
    }
    */
    // echo("value is: ", value);
  }
};

export const groupBySeries = (seriesArray) => {
  let result = {};
  for (const [index, value] of seriesArray.entries()) {
    // echo("Value is:", value);
    let { series, ...rest } = value;
    result[series] = rest;
  }
  return result;
};
