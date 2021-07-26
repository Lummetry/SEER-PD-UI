import React from "react";
import { echoFor } from "components";
import { Row, Column } from "components/ui/basic";
import moment from "moment";
import { CloseButton, Button } from "components/ui/Button";
import { MBTable } from "components/table-mb/table-mb";

export const MBModal = ({ modal, ...params }) => {
  let echo = echoFor("MBModal");
  echo("params: ", params);
  let { startDate, steps } = params;
  let historySize = params && params.historySize ? params.historySize : "10";
  echo(`history size: ${historySize}`);

  let endDate = moment(startDate).add(steps, "days");
  let startDateAsString = moment(startDate).format("D MMM YYYY");
  let endDateAsString = endDate.format("D MMM YYYY");

  const onCancelClick = () => {
    modal.current.cancel();
  };
  const onOkClick = () => {
    modal.current.cancel();
  };
  return (
    <Column className="p-2 w-full" style={{ minHeight: "30rem" }}>
      <Row className="pt-4 pl-4 pr-2 items-center justify-between">
        <div className="text-lg font-medium leading-relaxed">
          {" "}
          {`Model benchmark for ${startDateAsString} - ${endDateAsString}`}
        </div>
        <CloseButton
          className="ml-8 p-3 items-center rounded hover:bg-gray-200"
          iconClassName="w-3 h-3"
          onClick={onCancelClick}
        />
      </Row>
      <Row className="p-4 max-h-full overflow-auto">
        <MBTable
          data={params.mbRows}
          // onRowClick={honTableRowClick}
        ></MBTable>
      </Row>
      <Row className="justify-center p-4">
        <Button onClick={onOkClick} className="w-32 font-semibold">
          OK
        </Button>
      </Row>
    </Column>
  );
};
