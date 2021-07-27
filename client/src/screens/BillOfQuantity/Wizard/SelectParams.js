import React from "react";
import { echoFor } from "components";
import { useWizardState } from "components/ui/Wizard/context";
import { Button, ButtonKind } from "components/ui/Button";
import { Column, Row } from "components/ui/basic";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { DatePicker } from "components";
import moment from "moment";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";
import { CalendarIcon } from "components/ui/Icons/Calendar";

export const SelectParams = params => {
  let echo = echoFor("SelectParams");
  const state = useWizardState();
  let {
    dates: [dates, setDates],
    steps: [numSteps, setNumSteps],
    wizard,
    updateDates,
    updateSteps,
    appDates,
    historySize: [historySize, setHistorySize],
    loaderView,
    onParamsSelected
  } = state;

  const handleOnChangeDate = values => {
    // const startDate = moment(values[0]);
    // const endDate = moment(values[1]);
    // const newSteps =
    //   endDate.endOf("day").diff(startDate.startOf("day"), "days") + 1;
    // echo("newSteps: ", newSteps);
    updateDates(values);
    // setDates(values);
    // dispatch("changeSteps", { newSteps });
  };

  return (
    <>
      <HeaderWithButton
        text="Bill of Quantity"
        onClick={() => wizard.current.goBack()}
      />
      <Row className="mt-6 justify-center bg-gray-100">
        <Column className="p-16">
          <Row className="justify-center">
            <p className="font-bold text-3xl p-4 self-center">
              How many days to predict?
            </p>
          </Row>
          <Row className="p-4 items-center justify-center">
            <div className="w-20 h-20">
              <CalendarIcon />
            </div>
          </Row>
          <Row className="mt-6 justify-between items-baseline">
            <div className="text-center text-lg font-medium text-gray-700 select-none items-center pr-4">
              Predict between
            </div>
            <DateRangePicker
              // hasCustomRendering={true}
              // ranges={[selectionRange]}
              value={dates}
              clearIcon={null}
              calendarIcon={null}
              onChange={handleOnChangeDate}
              minDate={appDates.minDate}
              maxDate={appDates.maxDate}
            />
            {/* <DatePicker
                  minDate={dates[0]}
                  maxDate={dates[1]}
                  dateRange={dates}
                  onChange={handleOnChangeDate}
                /> */}
          </Row>
          <Row className="mt-5 items-center justify-between">
            <div className="flex text-center text-lg font-medium text-gray-700 select-none items-baseline mr-2">
              Number of predicted days
            </div>
            <Row className="justify-center">
              <input
                className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16 font-medium text-sm"
                value={numSteps}
                onChange={e => updateSteps(e.target.value)}
              />
            </Row>
          </Row>
          {/* <Row className="mt-5 items-center justify-between">
            <div className="flex text-center text-lg font-medium text-gray-700 select-none items-baseline mr-2">
              Include days in the past
            </div>
            <Row className="justify-center">
              <input
                className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16 font-medium text-sm"
                value={historySize}
                onChange={e => setHistorySize(e.target.value)}
              />
            </Row>
          </Row> */}
          <Row className="justify-center mt-10">
            <Button kind={ButtonKind.White} onClick={onParamsSelected}>
              Continue
            </Button>
          </Row>
        </Column>
      </Row>
    </>
  );
};
