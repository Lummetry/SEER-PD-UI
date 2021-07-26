import React, { useState } from "react";

import { NormalDot, ActiveDot } from "./custom-dot";
import CustomTooltip from "./custom-tooltip";

import moment from "moment";
import { echo } from "components";

import {
  Brush,
  LineChart,
  ReferenceLine,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  ReferenceArea
} from "recharts";

const dateFormatter = inDate => {
  return moment(inDate).format("D MMM");
};

export const Grafic = props => {
  const [activeLines, setActiveLines] = useState(props.activeLines);

  echo("Props pentru grafic este: ", props);

  let className = props.className ? props.className : "";

  const data = props.row.data.lineValues;
  echo("Data pentru grafic este: ", data);
  const startDate = props.row.data.startDate;
  echo("Reality: ", data.Reality.data);
  const handleBrushChange = props => {
    const { startIndex, endIndex } = props;
    echo("handleBrushChange: ", props);
  };

  return (
    <div className={className}>
      <ResponsiveContainer aspect={2}>
        <LineChart
          data={data.Reality.data}
          margin={{ top: 8, right: 0, left: 10, bottom: 10 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          {props.activeLines.map((line, index) => {
            if (!data[line]) {
              echo(`${line} line not found`);
              return null;
            }
            return (
              <Line
                isAnimationActive={false}
                type="monotone"
                key={line}
                data={data[line].data}
                dataKey="y"
                name={line}
                stroke={props.getLineColor(index)}
                strokeWidth={1.5}
                // stroke="#8884d8"
                dot={<NormalDot />}
                activeDot={<ActiveDot />}
              />
            );
          })}
          <Tooltip
            content={
              <CustomTooltip
                data={props.row.data}
                getLineColor={props.getLineColor}
              />
            }
          />
          <YAxis
            // dataKey="y"
            axisLine={false}
            tickLine={false}
            padding={{ top: 0, bottom: 0 }}
            tickMargin={10}
            // domain={["auto", "auto"]}
            domain={["dataMin", "dataMax"]}
            scale="auto"
            orientation="right"
            interval="preserveStartEnd"
          ></YAxis>
          <XAxis
            dataKey="x"
            // scale="time"
            // domain={["auto", "auto"]}
            // domain={[-5,5]}
            domain={["dataMin", "dataMax"]}
            // domain={[-2,5]}
            interval="preserveStartEnd"
            padding={{ left: 0, right: 0, top: 0, bottom: 0 }}
            name="Day"
            tickFormatter={dayNumber => {
              return moment(startDate)
                .add(dayNumber, "days")
                .format("D MMM");
              // return "Day " + dayNumber;//</LineChart>dateFormatter(unixTime);
            }}
            tickMargin={20}
            type="number"
            // scale="auto"
            axisLine={false}
            tickLine={false}
          ></XAxis>
          {/* <Brush dataKey="x" startIndex={5} endIndex={10} onChange={handleBrushChange}> */}
          {/* <LineChart>
              <Line
                isAnimationActive={false}
                type="monotone"
                key="Reality"
                data={data.Reality.data}
                dataKey="y"
                name="Reality"
                stroke={props.getLineColor(0)}
                strokeWidth={1.5}
                // stroke="#8884d8"
                dot={<NormalDot />}
                activeDot={<ActiveDot />}
              />
            </LineChart> */}
          {/* </Brush> */}
          <ReferenceLine
            x={0}
            stroke="green"
            // label="Out of stock"
          />
          <ReferenceArea
            x1={0 - props.numPastSteps}
            x2={0}
            fillOpacity={0.15}
            // stroke="red" strokeOpacity={0.3}
          />
          {/* <Brush                data={data.Reality.data}
                startIndex={0} stroke={`#dae2e9`}>
              <LineChart>
              {
            props.activeLines.map((line, index) => {
              if (!data[line]) {
                echo(`${line} line not found`);
                return null;
              }
              return (
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  key={line}
                  data={data[line].data}
                  dataKey="y"
                  name={line}
                  stroke={props.getLineColor(index)}
                  strokeWidth={1.5}
                  // stroke="#8884d8"
                  dot={<NormalDot />}
                  activeDot={<ActiveDot />}
                />
              );
            })
          }
              </LineChart>
           </Brush> */}

          {/* <ReferenceArea x1={10} x2={15} y1={10} y2={20} stroke="red" strokeOpacity={0.3} /> */}
          {/* <Brush data={data} startIndex={ data != null ? (data.length) / 2 : 0} stroke={`#dae2e9`}> */}
          {/* <Brush data={data.steps} startIndex={0} stroke={`#dae2e9`}>
            
              <LineChart
              data={data.steps}
              >
              {props.activeLines.map((line, index) => {
              return (
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  key={line}
                  data={data.steps}
                  dataKey={line}
                  stroke={props.getLineColor(index)}
                  dot={false}
                  // stroke="#8884d8"
                  // dot={<CustomDot />}
                />
              );
            })}
              </LineChart>
            </Brush> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
