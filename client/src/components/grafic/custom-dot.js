import React from "react";

export const ActiveDot = props => {
  const { cx, cy, stroke, strokeWidth, r } = props;
    //  echo("props la ActiveDot sunt: ", props);
  return (
    <svg
      x={cx - r * 2 - strokeWidth}
      y={cy - r * 2 - strokeWidth}
      width={r * 4 + strokeWidth * 2}
      height={r * 4 + strokeWidth * 2}
      viewBox={"0 0 " + r * 4 + " " + r * 4}
    >
      <g>
        <circle
          cx={r * 2}
          cy={r * 2}
          fill={props.fill}
          r={r * 2 - strokeWidth}
          strokeWidth={props.strokeWidth}
          stroke={props.stroke}
        />
        <circle
          cx={r * 2}
          cy={r * 2}
          r={r}
          strokeWidth={props.strokeWidth}
          stroke={stroke}
          fill={stroke}
          fillOpacity={0.35}
        />
      </g>
    </svg>
  );
};

export const NormalDot = props => {
  const { cx, cy, stroke, strokeWidth, r } = props;
// echo("props la NormalDot sunt: ", props);
  return (
    <svg
      x={cx - r * 2 - strokeWidth}
      y={cy - r * 2 - strokeWidth}
      width={r * 4 + strokeWidth * 2}
      height={r * 4 + strokeWidth * 2}
      viewBox={"0 0 " + r * 4 + " " + r * 4}
    >
      <g>
        <circle
          cx={r * 2}
          cy={r * 2}
          fill={props.stroke}
          r={r * 1.5 - strokeWidth}
          strokeWidth={props.strokeWidth}
          stroke={props.stroke}
        />
        {/* <circle
          cx={r * 2}
          cy={r * 2}
          r={r}
          strokeWidth={props.strokeWidth}
          stroke={stroke}
          fill={stroke}
          fillOpacity={0.35}
        /> */}
      </g>
    </svg>
  );
};