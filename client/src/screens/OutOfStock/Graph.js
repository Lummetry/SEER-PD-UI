import React from "react";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";

import moment from "moment";

import { useAppState } from "context/App";
import { AssertionError } from "assert";
import { echo } from "components";

const CustomTooltip = ({ active, payload, label }) => {
  if (!payload[0]) return null;
  // echo("CustomTooltip pentru ", payload);
  let payloadData = payload[0].payload;

  if (active) {
    let day = payloadData.day;
    // let dayString = moment(day).format("D MMM YYYY");
    var value;
    if (payloadData.greenDay) value = payloadData.greenDay;
    else if (payloadData.redDay) value = payloadData.redDay;
    const paragraphs = payload.map((value, index) => {
      return (
        <p key={value.name} className="text-xs">{`${value.name}: ${
          value.payload[value.name]
        }`}</p>
      );
    });
    return (
      <div className="bg-white border-gray-500 shadow rounded-sm p-4">
        <p className="text-sm font-semibold">{day}</p>
        <p className="text-xs">{`Predicted sales: ${value}`}</p>
        {/* <p className="text-xs">Predicted: {payload[0].value}</p> */}
      </div>
    );
  }

  return null;
};

export function OutOfStockGraph(props) {
  console.assert(props.startDate);
  echo("OutOfStockGraph - props: ", props);
  let { outOfStockOnDay, isOutOfStock } = props;

  // let steps = props.row.graphData.steps;
  let steps = props.row.data.lineValues.LENSv502_VTSTC_4.data;
  var finalArray;

  if (isOutOfStock === false) {
    finalArray = Array.from({ length: steps.length }, (v, i) => {
      let currentDay = moment(props.startDate)
        .add(i, "days")
        .format("D MMM YYYY");
      return {
        greenDay: steps[i].y,
        day: currentDay
      };
    });
  } else {
    finalArray = Array.from({ length: steps.length }, (v, i) => {
      let currentDay = moment(props.startDate)
        .add(i, "days")
        .format("D MMM YYYY");
      if (i < outOfStockOnDay)
        return {
          greenDay: steps[i].y,
          day: currentDay
        };
      else if (i === outOfStockOnDay) {
        return {
          greenDay: steps[i].y,
          redDay: steps[i].y,
          day: currentDay
        };
      } else
        return {
          redDay: steps[i].y,
          day: currentDay
        };
    });
  }
  return (
    <>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart
          data={finalArray}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="greenValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#48bb78" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#48bb78" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="redValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fc8181" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fc8181" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis
            interval="preserveStartEnd"
            domain={["auto", "auto"]}
            scale="auto"
            padding={{ left: 0, right: 0, top: 0, bottom: 0 }}
            tickFormatter={value => {
              return moment(props.startDate)
                .add(value, "days")
                .format("D MMM");
            }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            padding={{ top: 0, bottom: 0 }}
            tickMargin={10}
            domain={["auto", "auto"]}
            scale="auto"
            orientation="right"
            interval="preserveStartEnd"
          ></YAxis>
          <CartesianGrid vertical={false} strokeDashArray="3 3" />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="greenDay"
            stroke="#009900"
            fill="url(#greenValue)"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="redDay"
            stroke="#AA0000"
            fill="url(#redValue)"
          />
          {props.isOutOfStock === true && (
            <ReferenceLine x={outOfStockOnDay} stroke="green" />
          )}
          <Tooltip content={CustomTooltip} />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
