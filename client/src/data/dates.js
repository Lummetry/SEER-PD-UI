import { nimAPI, lensAPI } from "./api";
import moment from "moment";

const cachedResponse = {
  data: {
    AET: "0.00s",
    DATASET_INFO: {
      CONFIG_PREPARED_UP_TO: "2018-12-31 00:00:00",
      CONFIG_PRESENT_DATE: "2018-12-31 00:00:00",
      CONFIG_START_DATE: "2016-01-01 00:00:00",
      NO_SERIES_AVAIL: 500,
      PREPARED_SERIES_DAYS: 1095
    },
    ERROR2: "Param 'START_DATE' missing from query",
    ERROR3: "Param 'STEPS' missing from query",
    ERROR4: "Param 'ID' missing from query",
    ERROR5: "Param 'BENCHMARK' missing from query",
    LENSLightInferenceServer: "0.9.2.5",
    "QUERY PARAM INFO": {
      BENCHMARK:
        "(optional) setting this field to 1 in request will ensure that SDAPI will try to return bencmarking information",
      DATASET_HANDLE:
        "text - this will be a unique dataset identifier known both by API and caller - '?' will return dataset info",
      ID: "list of number for required series, empty means all",
      MODEL:
        "text - unique model identifier - empty string will default like with the dataset handle - 'baseline' will enfore generation of baseline-based preditictions aside from default model",
      RETURN_Y_TEST:
        "(optional) setting this field to 1 in request will ensure that SDAPI will try to return target value if known",
      START_DATE:
        "YYYY-MM-DD - the date that will be considered the first day of 'predicted future'",
      STEPS:
        "number - how many steps to predict in future. START_DATE + STEPS must not exceed END_FEATS"
    },
    call_id: 18,
    client: "unk",
    server: "0.9.1.1"
  }
};

const getDates = async () => {
  // const response = await lensAPI.post(`/analyze`, {
  //   DATASET_HANDLE: "?",
  //   MODEL: "?",
  //   RETURN_Y_TEST: 1
  // });

  const response = cachedResponse;

  let config = response.data.DATASET_INFO;

  // let minDate = config.CONFIG_START_DATE;
  // let maxDate = config.CONFIG_PREPARED_UP_TO;
  // let presentDate = config.CONFIG_PRESENT_DATE;

  let minDate = moment(config.CONFIG_START_DATE, `YYYY-MM-DD`);
  let maxDate = moment(config.CONFIG_PREPARED_UP_TO, `YYYY-MM-DD`);
  let presentDate = moment(config.CONFIG_PRESENT_DATE, `YYYY-MM-DD`); //.subtract(15, "days");

  return {
    minDate: minDate.toDate(), //.format("YYYY-MM-DD"),
    presentDate: presentDate.toDate(), //.format("YYYY-MM-DD"),
    maxDate: maxDate.toDate() // .format("YYYY-MM-DD")
  };
};

export { getDates };
