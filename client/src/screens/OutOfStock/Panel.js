import React, { useState, useEffect } from "react";
import { echo } from "components";
import moment from "moment";
import { Row, Column } from "components/ui/basic";
import { OutOfStockGraph } from "./Graph";
import { IconWarning } from "components/icons";
import { getOutOfStockValues } from "data/OutOfStock";
import { ProductName, LocationName } from "components/ui";

const PropertyRow = ({ title, value }) => (
  <Row className="font-medium text-base mb-1 justify-between">
    <span className="mr-4">{title}</span>
    <span className="w-16 pl-1">{value}</span>
  </Row>
);

const EnoughStock = () => (
  <div
    className={`inline-block p-2 rounded text-center text-xs bg-green-200 font-semibold}`}
  >
    Enough stock
  </div>
);

const ActionRequired = ({ isOutOfStock, days, orderSize, startDate }) => {
  if (isOutOfStock === false) {
    return "No need to place order";
  }

  let dateAsString = moment(startDate)
    .add(days, "days")
    .format("D MMM YYYY");
  echo("Action required on  ", dateAsString);

  const daysSpan =
    days <= 0 ? (
      <span className="font-semibold">today</span>
    ) : (
      <span>
        on <span className="font-semibold">{dateAsString}</span>
      </span>
    );

  return (
    <Column>
      <div className="font-medium text-lg">Recommended steps</div>
      <Row className="items-center py-2 text-base">
        <div>
          Place order of <span className="font-semibold">{`${orderSize}`}</span>{" "}
          {daysSpan}
        </div>
      </Row>
    </Column>
  );
};

const OutOfStock = ({ startDate, day }) => {
  let date = moment(startDate)
    .add(day, "days")
    .format("D MMM YYYY");
  return (
    <div
      className={`inline-block p-2 rounded text-center text-xs bg-red-200 font-medium flex flex-row`}
    >
      <div className="w-4 h-4 mr-2">
        <IconWarning />
      </div>
      <div>Out of stock on {date}</div>
    </div>
  );
};

export const OutOfStockPanel = ({ data, index, row }) => {
  let { startDate, rows, numSteps: numDays } = data;

  //   const [isOutOfStock, setIsOutOfStock] = useState(false);
  //   const [outOfStockOnDay, setOutOfStockOnDay] = useState(-1);
  //   const [placeOrderIn, setPlaceOrderIn] = useState(null);
  //   let [orderSize, setOrderSize] = useState(0);
  // let currentRow = rows[index];

  let currentRow = row.original;
  echo("currentRow is: ", currentRow);
  const [leadTime, setLeadTime] = useState(currentRow.leadTime);
  let predictedDemand = currentRow.predictedDemand;

  const [initialStock, setInitialStock] = useState(currentRow.initialStock);
  let endDate = moment(startDate).add(numDays, "days");
  let startDateAsString = moment(startDate).format("D MMM YYYY");
  let endDateAsString = endDate.format("D MMM YYYY");

  const [state, setOutOfStockState] = useState({});

  const predictionArray = currentRow.data.lineValues.lummetry_seer.data;

  useEffect(() => {
    let outOfStockState = getOutOfStockValues(
      predictionArray,
      predictedDemand,
      initialStock,
      leadTime
    );
    setOutOfStockState(outOfStockState);
  }, [initialStock, currentRow, leadTime, predictionArray, predictedDemand]);
  return (
    <div className="border border-gray-100 bg-white mb-2 p-4">
      <Column>
        <Row className="justify-between">
          <div>
            <Row className="py-2">
              <ProductName id={currentRow.product} />
            </Row>
            <Row className="py-2">
              <LocationName id={currentRow.location} />
            </Row>
          </div>
          <Column className="justify-end">
            <div className="flex flex-row justify-between items-center">
              <span className="font-semibold text-base mr-4">Lead time </span>{" "}
              <input
                className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16 font-medium text-sm"
                value={leadTime}
                onChange={e => setLeadTime(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center mt-2">
              <span className="font-semibold text-base mr-4">
                Initial stock
              </span>{" "}
              <input
                className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16"
                value={initialStock}
                onChange={e => setInitialStock(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center py-2">
              <span className="font-semibold text-base mr-4">
                Predicted demand{" "}
              </span>{" "}
              <div className="px-2 py-1 w-16">
                {Math.ceil(parseFloat(currentRow.predictedDemand))}
              </div>
            </div>
          </Column>
        </Row>
        <Row className="py-4">
          <OutOfStockGraph
            startDate={startDate}
            row={currentRow}
            isOutOfStock={state.isOutOfStock}
            outOfStockOnDay={state.outOfStockOnDay}
          />
        </Row>
        {state.isOutOfStock === false ? (
          <Row className="py-4">
            <EnoughStock />
          </Row>
        ) : (
          <Column>
            <Row className="py-4">
              <OutOfStock startDate={startDate} day={state.outOfStockOnDay} />
            </Row>
            <ActionRequired
              startDate={startDate}
              isOutOfStock={state.isOutOfStock}
              days={state.placeOrderIn}
              orderSize={state.orderSize}
            />
          </Column>
        )}
      </Column>
    </div>
  );
};
