import React from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Button, ButtonKind } from "components/ui/Button";
import { Column, Row } from "components/ui/basic";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { SelectLocationsControl } from "screens/SelectLocations/Control";
import { echoFor } from "components";
import { StoreIcon } from "components/ui/Icons/Store";

export const SelectLocations = props => {
  let echo = echoFor("SelectLocations");
  const state = useWizardState();
  let {
    locationsAndProducts: [locationsAndProducts, setLocationsAndProducts],
    wizard,
    onLocationsSelected
  } = state;
  const onLocationSelectorChange = newData => {
    setLocationsAndProducts(newData);
  };
  // echo("SelectProducts - params: ", params);
  return (
    <>
      <HeaderWithButton
        text="Bill of Quantity"
        onClick={wizard.current.goBack}
      />
      <Row className="mt-6 justify-center bg-gray-100">
        <Column className="p-10">
          <Row className="justify-center">
            <p className="font-bold text-3xl p-4 self-center text-center">
              Select one or more locations <br />
              and products for each location
            </p>
          </Row>
          <Row className="p-4 items-center justify-center">
            <div className="w-20 h-20">
              <StoreIcon />
            </div>
          </Row>
          <Row className="mt-4 justify-center">
            <SelectLocationsControl
              onChange={onLocationSelectorChange}
              data={locationsAndProducts}
            />
          </Row>
          {locationsAndProducts.selectedLocations.length > 0 && (
            <Row className="justify-center pt-4">
              <Button kind={ButtonKind.White} onClick={onLocationsSelected}>
                Continue
              </Button>
            </Row>
          )}
        </Column>
      </Row>
    </>
  );
};
