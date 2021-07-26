import React from "react";

export const Position = {
  Top: {
    Left: "items-start justify-start",
    Center: "items-start justify-center",
    Right: "items-start justify-end"
  },
  Middle: {
    Left: "items-center justify-start",
    Center: "items-center justify-center",
    Right: "items-center justify-end"
  },
  Bottom: {
    Left: "items-end justify-start",
    Center: "items-end justify-center",
    Right: "items-end justify-end"
  }
};

export const Positioned = ({
  className: customClassName,
  position,
  children
}) => {
  let className = customClassName ? customClassName : "";
  return <div className={"positioned absolute left-0 top-0 bottom-0 right-0 flex " + position + " " + className}>{children}</div>;
};

export const TopLeft = ({
    className: customClassName,
    children
  }) => {
    let className = customClassName ? customClassName : "";
    return <div className={"top-left absolute top-0 left-0 "+ className}>{children}</div>;
  };

  export const TopRight = ({
    className: customClassName,
    children
  }) => {
    let className = customClassName ? customClassName : "";
    return <div className={"top-right absolute top-0 right-0 "+ className}>{children}</div>;
  };