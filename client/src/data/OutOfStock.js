import { echo } from "components";

export const getOutOfStockValues = (
  predictionArray,
  predictedDemand,
  initialStock,
  leadTime
) => {
  var remainingStock = initialStock;
  if (initialStock === 0) {
    return {
      isOutOfStock: true,
      outOfStockOnDay: 0,
      placeOrderIn: 0 - leadTime,
      orderSize: Math.ceil(parseFloat(predictedDemand))
    };
  }
  var currentDay = 0;

  let numDays = predictionArray.length;
  let lastDay = numDays - 1;
  do {
    let currentDayPredicted = predictionArray[currentDay].y;
    remainingStock = (remainingStock - currentDayPredicted).toFixed(2);
    if (remainingStock <= 0) {
      break;
    }
    currentDay = currentDay + 1;
  } while (currentDay < numDays);

  if (remainingStock <= 0) {
    if (Number(remainingStock) === Number(0) && currentDay === lastDay) {
      return { isOutOfStock: false };
    }

    var orderSize = predictedDemand - initialStock;
    return {
      isOutOfStock: true,
      outOfStockOnDay: currentDay,
      placeOrderIn: currentDay - leadTime,
      orderSize: Math.ceil(parseFloat(orderSize))
    };
  } else {
    return {
      isOutOfStock: false,
      outOfStockOnDay: -1,
      placeOrderIn: 0,
      orderSize: 0
    };
  }
};

export const getOutOfStockData = (
  series,
  seriesData,
  prodLocSeries,
  numSteps,
  startDate
) => {
  let rows = [];
  let numSeries = prodLocSeries.length;
  let lummetryModelKey = null;
  for (let seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
    var lineValues = {};
    for (var key in seriesData.RESULTS) {
      let newLine = {};
      newLine.desc = seriesData.RESULTS[key].DESC;
      // echo("Descriere: ", newLine.desc.toLowerCase());
      if (newLine.desc.toLowerCase().includes("lummetry")) {
        lummetryModelKey = key;
        echo(`Lummetry model: ${key}`);
      }

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
      let numPastSteps = 10;
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

    // Add outOfStockData
    let predictedDemand =
      seriesData.BENCHMARK.SERIES[lummetryModelKey].PRED_QTY[seriesIndex];
    let predictionArray = lineValues[lummetryModelKey].data;
    let initialStock = Math.ceil(predictedDemand / 2);
    let leadTime = 1;
    let outOfStockState = getOutOfStockValues(
      predictionArray,
      predictedDemand,
      initialStock,
      leadTime
    );
    rows.push({
      series: series[seriesIndex],
      product: prodLocSeries[seriesIndex].product,
      location: prodLocSeries[seriesIndex].location,
      data: {
        lineValues: lineValues,
        startDate: startDate
      },
      predictedDemand: predictedDemand,
      realDemand: seriesData.BENCHMARK.SERIES.__TARGET__[seriesIndex],
      confidence:
        seriesData.BENCHMARK.SERIES[lummetryModelKey].CONFIDENCE[seriesIndex],      
      ...outOfStockState
    });
  }
  return {
    rows: rows,
    startDate: startDate,
    numSteps: numSteps
  };
};

export const getOutOfStockData2 = (
  seriesWithConfig,
  seriesData,
  seriesWithConfigGrouped,
  numSteps,
  startDate
) => {
  let rows = [];
  let lummetryModelKey = null;

  for (const [seriesIndex, currentSeries] of seriesWithConfig.entries()) {
    var lineValues = {};
    for (var key in seriesData.RESULTS) {
      let newLine = {};
      newLine.desc = seriesData.RESULTS[key].DESC;
      // echo("Descriere: ", newLine.desc.toLowerCase());
      if (newLine.desc.toLowerCase().includes("lummetry")) {
        lummetryModelKey = key;
      }

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
      let numPastSteps = 10;
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

    // Add outOfStockData
    let predictedDemand =
      seriesData.BENCHMARK.SERIES[lummetryModelKey].PRED_QTY[seriesIndex];    
    let predictionArray = lineValues[lummetryModelKey].data;
    let initialStock = currentSeries.initialStock;
    let leadTime = currentSeries.leadTime;
    let outOfStockState = getOutOfStockValues(
      predictionArray,
      predictedDemand,
      initialStock,
      leadTime
    );
    rows.push({
      ...currentSeries, // fields: series, product, location
      data: {
        lineValues: lineValues,
        startDate: startDate
      },
      predictedDemand: predictedDemand,
      realDemand: seriesData.BENCHMARK.SERIES.__TARGET__[seriesIndex],
      confidence:
        seriesData.BENCHMARK.SERIES[lummetryModelKey].CONFIDENCE[seriesIndex],
      ...outOfStockState
    });
  }
  return {
    rows: rows,
    startDate: startDate,
    numSteps: numSteps
  };
};
