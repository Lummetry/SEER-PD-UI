import React, { useEffect } from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Column, Row } from "components/ui/basic";
import { SelectProductsIcon, SelectLocationIcon } from "components/ui/Icons";
import { echoFor } from "components";
import { SelectProducts } from "./SelectProducts";

export const Home = params => {
  let echo = echoFor("Home");
  const state = useWizardState();
  let { onSelectByProduct, onSelectByLocation, wizard } = state;
  echo("state is: ", state);
  useEffect(() => {
    // wizard.current.setDirection("left");
  }, [wizard]);

  let buttonClassName =
    "w-1/2 rounded-lg border border-gray-400 hover:border-blue-400 cursor-pointer bg-white p-4";
  return (
    <div className="p-8">
      <Row className="mt-6 justify-center bg-gray-100">
        <Column>
          <p className="font-bold text-3xl p-4 self-center">
            What would you like to analyze?
          </p>
          <Row className="mt-10">
            <Column className={buttonClassName} onClick={onSelectByProduct}>
              <div className="h-16 font-semibold text-xl text-center">
                Products across multiple locations
              </div>
              <div className="p-4">
                <SelectProductsIcon />
              </div>
            </Column>
            <div className="w-12"></div>
            <Column className={buttonClassName} onClick={onSelectByLocation}>
              <div className="h-16 font-semibold text-xl text-center">
                Products in a single location
              </div>
              <div className="p-4">
                <SelectLocationIcon />
              </div>
            </Column>
          </Row>
          <p className="font-medium text-lg p-4 self-center text-center mt-6">
            Start by clicking one of the options above.
          </p>
        </Column>
      </Row>
    </div>
  );
};
