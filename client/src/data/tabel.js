/* eslint-disable no-lone-blocks */
import { echo } from "components";

export const getRowsData = (
  series,
  seriesData,
  prodLocSeries,
  numSteps,
  startDate,
  historySize
) => {
  let rows = [];
  let numSeries = prodLocSeries.length;
  let numPastSteps = historySize ? historySize : 10;
  for (let seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
    var lineValues = {};
    for (var key in seriesData.RESULTS) {
      let newLine = {};
      newLine.desc = seriesData.RESULTS[key].DESC;
      newLine.startDate = startDate;
      newLine.data = [];
      for (let stepIndex = 0; stepIndex < numSteps; stepIndex++) {
        let newStep = {};
        newStep.x = stepIndex;
        newStep.y = seriesData.RESULTS[key].PRED[seriesIndex][stepIndex];
        newLine.data.push(newStep);
      }
      lineValues[key] = newLine;
    }
    // Add reality
    {
      let newLine = {};
      newLine.desc = "Reality";
      newLine.startDate = startDate;
      newLine.data = [];
      // Add past
      for (let stepIndex = 0; stepIndex < numPastSteps; stepIndex++) {
        let newStep = {};
        newStep.x = 0 - numPastSteps + stepIndex;
        newStep.y = seriesData.Y_PAST[seriesIndex][stepIndex];
        newLine.data.push(newStep);
      }
      // Add present
      for (let stepIndex = 0; stepIndex < numSteps; stepIndex++) {
        let newStep = {};
        newStep.x = stepIndex;
        newStep.y = seriesData.Y_TEST[seriesIndex][stepIndex];
        newLine.data.push(newStep);
      }
      lineValues.Reality = newLine;
    }
    rows.push({
      series: series[seriesIndex],
      product: prodLocSeries[seriesIndex].product,
      location: prodLocSeries[seriesIndex].location,
      data: {
        lineValues: lineValues,
        startDate: startDate
      },
      predictedDemand:
        seriesData.BENCHMARK.SERIES.lummetry_seer.PRED_QTY[seriesIndex],
      realDemand: seriesData.BENCHMARK.SERIES.__TARGET__[seriesIndex],
      confidence:
        seriesData.BENCHMARK.SERIES.lummetry_seer.CONFIDENCE[seriesIndex]
    });
  }
  return rows;
};

export const getMBRowsData = seriesData => {
  const bestBaselines = seriesData.BENCHMARK.BEST_BASELINES;
  var rows = [];
  var model;
  for (model in seriesData.BENCHMARK.STATS) {
    if (bestBaselines.includes(model) || model.startsWith("lummetry_seer")) {
      let { MCODE, ...values } = seriesData.BENCHMARK.STATS[model];
      let row = {
        model: model,
        ...values
      };

      rows.push(row);
    }
  }
  for (model in seriesData.BENCHMARK.STATS) {
    if (model.startsWith("lummetry_seer")) {
      continue;
    }
    if (!bestBaselines.includes(model)) {
      let { MCODE, ...values } = seriesData.BENCHMARK.STATS[model];
      let row = {
        model: model,
        ...values
      };

      rows.push(row);
    }
  }
  return rows;
};
