import React, { forwardRef, useState } from "react";
import { Modal, ModalPosition, ModalDefaultClasses } from "components/ui/Modal";
import { echoFor } from "components";
import { Row, Column } from "components/ui/basic";
import { Button, CloseButton } from "components/ui/Button";
import { OutOfStockPanel } from "./Panel";
import moment from "moment";

var cloneDeep = require("lodash.clonedeep");

export const OutOfStockModal = ({ modal, ...params }) => {
  let echo = echoFor("OutOfStockModal");
  let currentRow = params.row;
  let { startDate, rows, numSteps: numDays } = params.data;
  let endDate = moment(startDate).add(numDays, "days");
  let startDateAsString = moment(startDate).format("D MMM YYYY");
  let endDateAsString = endDate.format("D MMM YYYY");

  const onCancelClick = () => {
    modal.current.cancel();
  };

  const onOkClick = () => {
    modal.current.cancel();
  };

  return (
    <Column className="p-2 w-full">
      <Row className="pt-4 pl-4 pr-2 items-center justify-between">
        <div className="text-lg font-medium leading-relaxed">
          {`Sales prediction for ${startDateAsString} - ${endDateAsString}`}
        </div>
        <CloseButton
          className="ml-8 p-3 items-center rounded hover:bg-gray-200"
          iconClassName="w-3 h-3"
          onClick={onCancelClick}
        />
      </Row>
      <OutOfStockPanel
        data={params.data}
        index={params.index}
        row={currentRow}
      />

      <Row className="justify-center p-4">
        <Button onClick={onOkClick} className="w-32 font-semibold">
          OK
        </Button>
      </Row>
    </Column>
  );
};
