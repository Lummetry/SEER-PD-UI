import React from "react";
import { echo } from "components";

export const Row = props => {
  const { className, ...rest } = props;
  //  echo("Row - props: ", props);
  //  echo("Row - rest: ", rest);
  let extraClassName = className !== undefined ? className : "";
  return (
    <div className={"row flex flex-row " + extraClassName} {...rest}>
      {props.children}
    </div>
  );
};
