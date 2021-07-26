import React, { useEffect } from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Column, Row } from "components/ui/basic";
import { Button, ButtonKind } from "components/ui/Button";
import { echoFor } from "components";
import { saveSettings } from "data/Settings";

import { BoQIcon } from "components/ui/Icons";
export const Home = props => {
  let echo = echoFor("Home");
  echo("props is: ", props);
  const state = useWizardState();
  let { wizard, onHomeContinue } = state;
  echo("state is: ", state);

  echo("wizard is: ", wizard.current);
  if (wizard.current) {
    echo("wizard state is: ", wizard.current.getState());
  }

  const onContinueClick = () => {
    onHomeContinue();
    // saveSettings({ o_setare: 1, alta_setare: 2 });
  };

  // useEffect(() => {
  //   onHomeContinue();
  // }, []);

  return (
    <div className="p-8">
      <Row className="mt-6 justify-center bg-gray-100">
        <Column>
          <p className="font-bold text-3xl p-4 self-center">Bill of Quantity</p>
          <Row className="p-16">
            <div className="w-full">
              <BoQIcon />
            </div>
          </Row>
          <p className="font-medium text-lg p-4 self-center text-center mt-6">
            Let LENS help you never run out of stock.
          </p>
          <p className="font-medium text-base self-center text-center">
            Click below to get started
          </p>
          <Row className="justify-center mt-10">
            <Button kind={ButtonKind.White} onClick={onContinueClick}>
              Get started
            </Button>
          </Row>
        </Column>
      </Row>
    </div>
  );
};
