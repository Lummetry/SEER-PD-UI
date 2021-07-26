import React, { Component } from "react";
import { StateContext } from "context/App";
import moment from "moment";
import { echo } from "components";

// import DateRangePicker from "@wojtekmaj/react-daterange-picker";
// import DatePicker from "react-date-picker";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";

class DatePicker extends Component {
  static contextType = StateContext;

  componentDidMount() {
    const [{ dates, steps }, dispatch] = this.context;
    this.setState({
      dateValue: [dates.presentDate, dates.maxDate]
    });
  }
  state = {
    dateValue: []
  };
  handleChange = values => {
    echo("handleChange: ", values);
    const [{ dates }, dispatch] = this.context;

    var newDates = Object.assign({}, dates);
    const startDate = moment(values[0]);
    const endDate = moment(values[1]);
    const newSteps = endDate.diff(startDate, "days");
    newDates.presentDate = startDate.toDate();

    dispatch({ type: "changeDates", newDates: newDates, newSteps: newSteps });

    // this.setState({ dateValue: values });

    // {
    // 	selection: {
    // 		startDate: [native Date Object],
    // 		endDate: [native Date Object],
    // 	}
    // }
  };
  render() {
    echo("Datepicker - render - props: ", this.props);
    const [{ dates }, dispatch] = this.context;
    return (
      <div className="text-gray-600 select-none">
        <DateRangePicker
          // hasCustomRendering={true}
          // ranges={[selectionRange]}
          value={this.state.dateValue}
          clearIcon={null}
          calendarIcon={null}
          onChange={this.handleChange}
          minDate={dates.minDate}
          maxDate={dates.maxDate}
        />
      </div>
    );
  }
}

export { DatePicker };
