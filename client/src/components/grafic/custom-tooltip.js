import React from "react";
import moment from "moment";

const CustomTooltip = props => {
  const { active, payload, label } = props;
  if (!payload) return null;
  if (!active) return null;
  const startDate = props.data.startDate;
  const dayNumber = props.payload[0].payload.x;
  
  let dayString = moment(startDate)
    .add(dayNumber, "days")
    .format("D MMM YYYY");
  const paragraphs = payload.map((item, index) => {
    const model = props.data.lineValues[item.name];
    const modelName = model.desc;
    return (
      <div key={"tooltip-p-" + index}className="flex flex-row items-center">
        <div
          className="w-3 h-3 flex-none"
          style={{ backgroundColor: props.getLineColor(index) }}
        />
        <p
          key={item.name}
          className="ml-2 text-xs"
        >{`${modelName}: ${item.value}`}</p>
      </div>
    );
  });
  return (
    <div className="bg-white border-gray-500 shadow rounded-sm p-4">
      <p className="text-sm font-semibold mb-2">{dayString}</p>
      {paragraphs}
      {/* <p className="text-xs">Predicted: {payload[0].value}</p> */}
    </div>
  );
};

export default CustomTooltip;
