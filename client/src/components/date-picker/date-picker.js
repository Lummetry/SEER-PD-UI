import React, { useState } from "react";
import moment from "moment";
import { echo } from "components";

// import DateRangePicker from "@wojtekmaj/react-daterange-picker";
// import DatePicker from "react-date-picker";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";

const DatePicker = props => {
  const [dateRange, setDateRange] = useState(props.dateRange);

  const handleChange = values => {
    echo("handleChange: ", values);
    setDateRange(values);
    if (props.onChange) {
      props.onChange(values);
    }

    // const [{ dates }, dispatch] = this.context;

    // var newDates = Object.assign({}, dates);
    // const startDate = moment(values[0]);
    // const endDate = moment(values[1]);
    // const newSteps = endDate.diff(startDate, 'days');
    //
    // newDates.presentDate = startDate.toDate();

    // dispatch({type:'changeDates', newDates: newDates, newSteps: newSteps});

    // this.setState({ dateValue: values });

    // {
    // 	selection: {
    // 		startDate: [native Date Object],
    // 		endDate: [native Date Object],
    // 	}
    // }
  };
  return (
    <div className="text-gray-600 select-none">
      <DateRangePicker
        // hasCustomRendering={true}
        // ranges={[selectionRange]}
        value={dateRange}
        clearIcon={null}
        calendarIcon={null}
        onChange={handleChange}
        minDate={props.minDate}
        maxDate={props.maxDate}
      />
    </div>
  );
};

export { DatePicker };
