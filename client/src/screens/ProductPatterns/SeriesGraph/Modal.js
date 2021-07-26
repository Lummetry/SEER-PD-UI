import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Modal, ModalPosition, ModalDefaultClasses } from "components/ui/Modal";
import { Row, Column } from "components/ui/basic";
import { CloseButton, Button } from "components/ui/Button";
import { echoFor } from "components";
import { Grafic } from "components/grafic";
import { getLinesObject } from "data/grafic";
import { DropdownMultiSelect } from "components";
import { ProductName, LocationName } from "components/ui";

import { ItemsLegend } from "./items-legend";
import moment from "moment";

var cloneDeep = require("lodash.clonedeep");

const defaultColors = [
  "#48bb78",
  // "hsl(351, 70%, 50%)",
  "hsl(217, 70%, 50%)",
  "hsl(25, 70%, 50%)",
  "#d45087",
  "#ff7c43",
  "#ffa600",
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#f95d6a"
];

const getLineColor = index => {
  return defaultColors[index];
};

export const SeriesGraphModal = ({ modal, ...params }) => {
  let echo = echoFor("SeriesGraphModal");
  echo("params: ", params);
  let { startDate, steps } = params;
  let historySize = params && params.historySize ? params.historySize : "10";
  echo(`history size: ${historySize}`);
  let newStartDate = moment(startDate).add(0 - historySize, "days");
  let endDate = moment(startDate).add(steps, "days");
  let startDateAsString = moment(startDate).format("D MMM YYYY");
  let newStartDateAsString = moment(newStartDate).format("D MMM YYYY");
  let endDateAsString = endDate.format("D MMM YYYY");

  const linesDropdown = useRef(null);
  const [activeLines, setActiveLines] = useState([
    "Reality",
    "LENSv502_VTSTC_4"
  ]);
  const [linesObject, setlinesObject] = useState(null);

  const onCancelClick = () => {
    modal.current.cancel();
  };

  const onOkClick = () => {
    modal.current.cancel();
  };

  useEffect(() => {
    echo("SeriesGraphModal - onOpen - params: ", params);
    const { seriesData, bestBaselines } = params;
    const linesObject = getLinesObject(seriesData, bestBaselines);
    setlinesObject(linesObject);
    return;
  }, []);

  const onActiveLinesChange = newLines => {
    setActiveLines(newLines);
  };

  const onRemoveLegendItem = item => {
    echo("onRemoveLegendItem: ", item, " - ", linesDropdown.current);
    linesDropdown.current.removeItem(item);
  };

  return (
    <Column className="p-2 w-full" style={{ minHeight: "30rem" }}>
      <Row className="pt-4 pl-4 pr-2 items-center justify-between">
        <div className="text-lg font-medium leading-relaxed">
          {" "}
          {`Series graph for ${newStartDateAsString} - ${endDateAsString}`}
        </div>
        <CloseButton
          className="ml-8 p-3 items-center rounded hover:bg-gray-200"
          iconClassName="w-3 h-3"
          onClick={onCancelClick}
        />
      </Row>
      <Row className="p-4">
        <div className="w-3/4">
          <Grafic
            className="-ml-2"
            numPastSteps={historySize}
            row={params.row}
            lines={linesObject}
            activeLines={activeLines}
            getLineColor={getLineColor}
          />
        </div>
        <Column className="w-1/4">
          <Row className="py-2">
            <ProductName id={params.row.product} />
          </Row>
          <Row className="py-2">
            <LocationName id={params.row.location} />
          </Row>
          <div className="">
            <DropdownMultiSelect
              ref={linesDropdown}
              // inputValue={inputValue}
              allItems={linesObject}
              selectedItems={activeLines}
              onSelectionChanged={onActiveLinesChange}
            />
            <div className="pt-4">
              <ItemsLegend
                items={activeLines}
                allItems={linesObject}
                onRemoveItem={onRemoveLegendItem}
                getLineColor={getLineColor}
              ></ItemsLegend>
            </div>
            <div className="pt-4">
              <div>
                <span className="">Predicted demand: </span>
                <span className="font-medium">
                  {Math.ceil(parseFloat(params.row.predictedDemand))}
                </span>
              </div>
              <div>
                <span className="">Real demand: </span>
                <span className="font-medium">{params.row.realDemand}</span>
              </div>
            </div>
          </div>
        </Column>
      </Row>
      <Row className="justify-center p-4">
        <Button onClick={onOkClick} className="w-32 font-semibold">
          OK
        </Button>
      </Row>
    </Column>
  );
};
