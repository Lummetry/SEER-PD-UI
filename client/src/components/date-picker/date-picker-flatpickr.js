import React, { Component } from "react";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import { echo } from "components";

class DatePicker extends Component {
  constructor() {
    super();

    this.state = {
      date: new Date()
    };
  }

  render() {
    const { date } = this.state;
    echo("DatePicker render - props: ", this.props);
    const { dates } = this.props;
    const minMaxDates = [dates.presentDate, dates.maxDate];

    const options = {
      mode: "range",
      showMonths: 2,
      dateFormat: "Y-m-d",
      defaultDate: minMaxDates,
      minDate: dates.minDate,
      maxDate: dates.maxDate
    };

    echo("Flatpickr options: ", options);

    return (
      <Flatpickr
        options={options}
        value={date}
        onChange={date => {
          this.setState({ date });
        }}
      />
    );
  }
}

export { DatePicker };
