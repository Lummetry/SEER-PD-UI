import React from "react";
import { LocationIcon } from "components/ui/Icons";
import { Row } from "components/ui/basic";

export const LocationName = ({ id, iconClass, textClass, containerClass }) => {
  return (
    <Row className={containerClass ? containerClass : "items-center "}>
      <div
        className={
          iconClass ? iconClass : "w-4 h-4 mr-2 flex-none text-gray-600"
        }
      >
        <LocationIcon />
      </div>
      <div className={textClass ? textClass : "font-semibold text-base"}>
        {"Location " + id}
      </div>
    </Row>
  );
};
