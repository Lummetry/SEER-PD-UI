import React, { useState, useEffect } from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { echoFor } from "components";
import { OutOfStockTable } from "screens/OutOfStock/Table";
import { Button, ButtonKind } from "components/ui/Button";

import { Column, Row } from "components/ui/basic";

import { showModal } from "components/ui/Modal";
import { OutOfStockModal } from "screens/OutOfStock/Modal";
import moment from "moment";

export const BoQReport = ({ outOfStockData }) => {
  let echo = echoFor("BoQReport");
  const state = useWizardState();
  let {
    wizard,
    goHome,
    modalParent,
    dates: [dates, setDates],
    steps: [steps, setNumSteps]
  } = state;

  let startDate = dates[0];

  let endDate = moment(startDate).add(steps, "days");
  let startDateAsString = moment(startDate).format("D MMM YYYY");
  let endDateAsString = endDate.format("D MMM YYYY");

  echo("outOfStockData is: ", outOfStockData);

  let rangString = `${startDateAsString} - ${endDateAsString}`;

  const [onlyOutOfStockData, setOnlyOutOfStockData] = useState(null);

  useEffect(() => {
    let onlyOutOfStockRows = outOfStockData.rows.filter(value => {
      return value.isOutOfStock;
    });
    let onlyOutOfStockDataLocal = {
      startDate: outOfStockData.startDate,
      numSteps: outOfStockData.numSteps,
      rows: onlyOutOfStockRows
    };
    echo("onlyOutOfStockDataLocal is: ", onlyOutOfStockDataLocal);
    setOnlyOutOfStockData(onlyOutOfStockDataLocal);
  }, []);

  const onOOSTableRowClick = async row => {
    let { index, original: rowData } = row;
    echo("Clicked on row:", row);
    showModal(
      OutOfStockModal,
      modalParent,
      {
        params: {
          data: outOfStockData,
          index: index,
          row: row
        },
        on: {
          submit: result => {}
        }
      },
      "w-full"
    );
    // outOfStockModal.current.open({ data: outOfStockData, index: row.index });
  };
  return (
    <>
      <HeaderWithButton
        text="Bill of Quantity"
        onClick={() => wizard.current.goBack()}
      />
      <Column className="p-16">
        <Row className="justify-center">
          <p className="font-bold text-3xl p-4 self-center mb-4">
            Bill of Quantity report for <br /> {rangString}
          </p>
        </Row>
        <Row
          className="mt-10 justify-center overflow-auto border rounded"
          style={{ maxHeight: "20rem" }}
        >
          <OutOfStockTable
            data={outOfStockData}
            onRowClick={onOOSTableRowClick}
          />
        </Row>
        {onlyOutOfStockData && (
          <>
            <Row className="justify-center">
              <p className="font-bold text-3xl p-8 self-center mt-4">
                Required Bill
              </p>
            </Row>
            <Row
              className="mt-6 justify-center overflow-auto border rounded"
              style={{ maxHeight: "20rem" }}
            >
              <OutOfStockTable
                data={onlyOutOfStockData}
                onRowClick={onOOSTableRowClick}
              />
            </Row>
          </>
        )}
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
