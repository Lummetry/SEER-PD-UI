import React from "react";
import { ChevronRight2Icon } from "components/ui/Icons";
import { Button, ButtonKind } from "components/ui/Button";
import { Row } from "components/ui/basic";

export const HeaderWithButton = ({ text, onClick }) => {
  return (
    <div className="bg-white h-16 p-3 border-b border border-gray-200 items-center flex flex-none">
      <Row className="items-center">
        <Button kind={ButtonKind.Transparent} onClick={() => onClick()}>
          <div className="w-6 h-6">
            <ChevronRight2Icon />
          </div>
        </Button>
        <div
          className="font-medium text-lg select-none cursor-pointer"
          onClick={() => onClick()}
        >
          {text}
        </div>
      </Row>
    </div>
  );
};
