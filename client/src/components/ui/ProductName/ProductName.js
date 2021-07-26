import React from "react";
import { ProductIcon } from "components/icons";
import { Row } from "components/ui/basic";

export const ProductName = ({ id, iconClass, textClass, containerClass }) => {
  return (
    <Row className={containerClass ? containerClass : "items-center "}>
      <div
        className={
          iconClass ? iconClass : "w-4 h-4 mr-2 flex-none text-gray-600"
        }
      >
        <ProductIcon />
      </div>
      <div className={textClass ? textClass : "font-semibold text-base"}>
        {"Product " + id}
      </div>
    </Row>
  );
};
