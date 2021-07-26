import React from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Button, ButtonKind } from "components/ui/Button";
import { Column, Row } from "components/ui/basic";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { SelectLocationsControl } from "screens/SelectLocations/Control";
import { StoreIcon } from "components/ui/Icons/Store";


export const SelectLocations = params => {
  const state = useWizardState();
  let {
    locationsAndProducts: [locationsAndProducts, setLocationsAndProducts],
    onLocationsSelected,
    wizard
  } = state;
  const onLocationSelectorChange = newData => {
    setLocationsAndProducts(newData);
  };
  // echo("SelectProducts - params: ", params);
  return (
    <>
      <HeaderWithButton
        text="Demand Pattern Analysis"
        onClick={() => wizard.current.goBack()}
      />
      <Row className="mt-6 justify-center bg-gray-100">
        <Column className="p-10">
          <Row className="justify-center">
            <p className="font-bold text-3xl p-4 self-center">
              Select one or more locations
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
              <Button
                kind={ButtonKind.White}
                onClick={() => onLocationsSelected()}
              >
                Continue
              </Button>
            </Row>
          )}
        </Column>
      </Row>
    </>
  );
};
