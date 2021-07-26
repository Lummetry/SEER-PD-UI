import React from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Button, ButtonKind } from "components/ui/Button";
import { Column, Row } from "components/ui/basic";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { SelectProductsControl } from "screens/SelectProducts/Control";

export const SelectProducts = ({ screens }) => {
  const state = useWizardState();
  let {
    productsAndLocations: [productsAndLocations, setProductsAndLocations],
    onProductsSelected,
    wizard
  } = state;
  const onProductSelectorChange = newData => {
    setProductsAndLocations(newData);
  };
  // echo("SelectProducts - params: ", params);
  return (
    <>
      <HeaderWithButton
        text="Demand Pattern Analysis"
        onClick={() => wizard.current.goBack()}
      />
      <Row className="mt-6 justify-center bg-gray-100">
        <Column className="p-16">
          <Row className="justify-center">
            <p className="font-bold text-3xl p-4 self-center">
              Select Products
            </p>
          </Row>
          <Row className="mt-10">
            <SelectProductsControl
              onChange={onProductSelectorChange}
              data={productsAndLocations}
            />
          </Row>
          {productsAndLocations.selectedProducts.length > 0 && (
            <Row className="justify-center pt-4">
              <Button
                kind={ButtonKind.White}
                onClick={() => onProductsSelected()}
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
