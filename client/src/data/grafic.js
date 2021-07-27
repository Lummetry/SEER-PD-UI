import moment from "moment";
import { echo } from "components";

const getLinesObject = (data, bestBaselines) => {
    echo("getLinesObject pentru: ", data, " si baselines: ", bestBaselines);
  var linesObject = { best: {}, others: {} };
  linesObject.others.Reality = { desc: "Reality" };
  for (var key in data.RESULTS) {
    let desc = data.RESULTS[key].DESC;
    if (bestBaselines.includes(key) || key.startsWith("lummetry_seer")) {
      linesObject.best[key] = { desc: desc };
    } else {
      linesObject.others[key] = { desc: desc };
    }
    //
    // linesObject.set(key, { desc: desc });
    // linesObject[key] = { desc: desc };
  }
  return linesObject;
};

const prepareGraphData = (data, numSeries, numSteps) => {
  echo("Number of series: ", numSeries);
  echo("Number of steps: ", numSteps);
  echo("DATASET_INFO: ", data);
  const startDate = moment(data.DATASET_INFO.CONFIG_PRESENT_DATE);
  const endDate = startDate.clone().add(numSteps, "days");

  var series = [];
  for (var seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
    var singleStepEntries = [];
    for (var stepIndex = 0; stepIndex < numSteps; stepIndex++) {
      let calculatedDate = startDate.clone();
      calculatedDate.add(stepIndex, "days");
      let timeAsNumber = calculatedDate.toDate().getTime();
      var singleStepEntry = {};
      // var keys = Object.keys(data.RESULTS);
      for (var key in data.RESULTS) {
        let value = data.RESULTS[key].PRED[seriesIndex][stepIndex];
        singleStepEntry[key] = value;
      }
      singleStepEntry.Reality = data.Y_TEST[seriesIndex][stepIndex];
      singleStepEntry.Day = timeAsNumber;
      singleStepEntries.push(singleStepEntry);
    }
    series[seriesIndex] = singleStepEntries;
  }
  return {
    startDate: startDate,
    endDate: endDate,
    series: series
  };
};

export { prepareGraphData, getLinesObject };
