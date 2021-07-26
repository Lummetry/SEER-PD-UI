import React from "react";
import { CloseIcon } from "components/ui/Icons";

export const ButtonKind = {
  All: "select-none",
  White:
    "rounded-lg border hover:border-2 border-gray-400 hover:border-gray-500 bg-white hover:shadow inline p-3 font-medium text-center text-base",
  Blue:
    "rounded-lg bg-blue-600 hover:bg-blue-700 text-white border-blue-700 font-semibold p-4",
  Transparent:
    "rounded w-10 h-10 flex items-center justify-center hover:bg-gray-200"
};

export const Button = props => {
  let { kind, className: customClassName, children, ...rest } = props;
  let className = customClassName ? customClassName : "";
  let buttonKindClass = kind ? kind : ButtonKind.White;
  return (
    <div
      className={
        "button cursor-pointer " +
        ButtonKind.All +
        " " +
        buttonKindClass +
        " " +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
};

export const CloseButton = props => {
  let {
    className: customClassName,
    iconClassName: customIconClassName,
    children,
    ...rest
  } = props;
  let className = customClassName ? customClassName : "";
  let iconClassName = customIconClassName ? customIconClassName : "";
  return (
    <div className={"cursor-pointer " + className} {...rest}>
      <div className={iconClassName}>
        <CloseIcon></CloseIcon>
      </div>
    </div>
  );
};
