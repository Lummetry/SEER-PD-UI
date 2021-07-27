import React from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Button, ButtonKind } from "components/ui/Button";
import { Column, Row } from "components/ui/basic";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { echoFor } from "components";

export const ReviewColumns = props => {
  let echo = echoFor("ReviewColumns");
  const state = useWizardState();
  let {
    locationsAndProducts: [locationsAndProducts, setLocationsAndProducts],
    wizard,
    onColumnsReviewContinue
  } = state;

  // echo("SelectProducts - params: ", params);
  let rowClassName = "p-4 mb-2 rounded border bg-white font-semibold";
  return (
    <>
      <HeaderWithButton
        text="Bill of Quantity"
        onClick={wizard.current.goBack}
      />
      <Row className="mt-6 justify-center bg-gray-100">
        <Column className="p-16">
          <Row className="justify-center">
            <p className="font-bold text-3xl p-4 self-center text-center">
              SEER will create a report with
              <br />
              the following columns
            </p>
          </Row>
          <Column>
            <Row className={rowClassName}>Product</Row>
            <Row className={rowClassName}>Location</Row>
            <Row className={rowClassName}>Will be out of stock</Row>
            <Row className={rowClassName}>Place order on</Row>
            <Row className={rowClassName}>Required Order Size</Row>
          </Column>
          {locationsAndProducts.selectedLocations.length > 0 && (
            <Row className="justify-center pt-4">
              <Button kind={ButtonKind.White} onClick={onColumnsReviewContinue}>
                Continue
              </Button>
            </Row>
          )}
        </Column>
      </Row>
    </>
  );
};
