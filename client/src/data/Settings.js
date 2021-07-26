import { nimAPI } from "./api";
import { echo } from "components";

// Settings param is an object containing keys and values we want to save
// const settingsToSave = {
//   default_lead_time: 4,
//   default_initial_stock: 10
// };

export const saveSettings = async settingsToSave => {
  let response = await nimAPI.post(`/settings`, {
    action: "save",
    param: settingsToSave
  });
  echo("saveSettings: ", settingsToSave, " - response: ", response.data);
};

export const getSettings = async settingsArray => {
  let response = await nimAPI.post(`/settings`, {
    action: "get",
    param: {
      settings: settingsArray
    }
  });
  echo("getSettings: ", settingsArray, " - response: ", response.data);
  return response.data;
};
