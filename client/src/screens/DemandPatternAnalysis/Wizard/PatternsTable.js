import React, { useRef } from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { LensTable } from "screens/ProductPatterns/Table";
import { showModal } from "components/ui/Modal";
import { MBModal } from "./MBModal";
import { SeriesGraphModal } from "screens/ProductPatterns/SeriesGraph/Modal";
import { echoFor } from "components";
import { Row, Column } from "components/ui/basic";
import { Button, ButtonKind } from "components/ui/Button";

import { getBestBaselines } from "data";
import moment from "moment";

export const PatternsTable = ({ rows, mbRows, series }) => {
  let echo = echoFor("PatternsTable");
  const state = useWizardState();
  let {
    wizard,
    dates: [dates, setDates],
    steps: [numSteps, setNumSteps],
    historySize: [historySize],
    loaderView,
    modalParent,
    goHome
  } = state;

  let startDate = dates[0];

  const seeBenchmark = () => {
    showModal(
      MBModal,
      modalParent,
      {
        params: {
          startDate,
          steps: numSteps,
          mbRows
        },
        on: {
          submit: result => {}
        }
      },
      "w-full"
    );
  };

  const honTableRowClick = async row => {
    echo("onTableRowClick - ", row);
    let seriesID = parseInt(row.original.series);
    loaderView.current.isLoading = true;
    let bestBaselines = await getBestBaselines(
      [seriesID],
      moment(startDate).format(`YYYY-MM-DD`),
      numSteps
    );
    echo("Best baselines: ", bestBaselines);
    loaderView.current.isLoading = false;
    showModal(
      SeriesGraphModal,
      modalParent,
      {
        params: {
          row: row.original,
          seriesData: series,
          bestBaselines,
          startDate: startDate,
          steps: numSteps,
          historySize: historySize
        },
        on: {
          submit: result => {}
        }
      },
      "w-full"
    );
  };

  let endDate = moment(startDate).add(numSteps, "days");
  let startDateAsString = moment(startDate).format("D MMM YYYY");
  let endDateAsString = endDate.format("D MMM YYYY");

  let rangString = `${startDateAsString} - ${endDateAsString}`;
  return (
    <>
      <HeaderWithButton
        text="Demand Pattern Analysis"
        onClick={() => wizard.current.goBack()}
      />
      <Column className="p-16">
        <Row className="justify-center">
          <p className="font-bold text-3xl p-4 self-center mb-4">
            Demand Pattern Analysis for <br /> {rangString}
          </p>
        </Row>
        <Row
          className="mt-10 justify-center overflow-auto border rounded"
          style={{ maxHeight: "20rem" }}
        >
          <LensTable data={rows} onRowClick={honTableRowClick} />
        </Row>
        <Row className="mt-8">
          <Button
            kind={ButtonKind.White}
            className="w-40 font-semibold"
            onClick={seeBenchmark}
          >
            See Benchmark
          </Button>
        </Row>
        <Row className="justify-center mt-10">
          <Button
            kind={ButtonKind.White}
            className="w-32 font-semibold"
            onClick={goHome}
          >
            OK
          </Button>
        </Row>
      </Column>
    </>
  );
};
