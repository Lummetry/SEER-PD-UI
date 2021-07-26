import React, { Component } from "react";
import { echo } from "components";
import {
  DateRangePicker,
  isInclusivelyBeforeDay,
  isInclusivelyAfterDay
} from "react-dates";
import { START_DATE, END_DATE } from "react-dates/constants";
// import moment from "moment";
class DatePicker extends Component {
  //   constructor(props) {
  //     super(props);
  //     echo("Propsu este: ", props);
  //     // this.state = {
  //     //   startDate: props.dates.presentDate.clone(),
  //     //   endDate: props.dates.maxDate.clone(),
  //     //   focusedInput: null
  //     // };
  //     this.state = {
  //       startDate: null,
  //       endDate: null,
  //       focusedInput: null
  //     };
  //   }

  //   state = {
  //     startDate: null,
  //     endDate: null,
  //     focusedInput: null
  //   };
  //   constructor(props) {
  //     super(props);

  //     this.state = {
  //       focusedInput: null,
  //       startDate: moment(), // set your initial start date here
  //       endDate: moment().add(10, "days") // set your initial end date here
  //     };
  //   }

  state = {
    startDate: this.props.dates.presentDate.clone(),
    endDate: this.props.dates.maxDate.clone(),
    focusedInput: null
  };

  componentDidMount() {
    echo("DatePicker componentDidMount: ", this.state);
    // this.setState({
    //   startDate: this.props.dates.presentDate.clone(),
    //   endDate: this.props.dates.maxDate.clone()
    // });
  }
  //   renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
  //     let i;
  //     let years = [];
  //     for (i = moment().year(); i >= this.state.startDate.year(); i--) {
  //       years.push(
  //         <option value={i} key={`year-${i}`}>
  //           {i}
  //         </option>
  //       );
  //     }
  //     return (
  //       <div style={{ display: "flex", justifyContent: "center" }}>
  //         <div>
  //           <select
  //             value={month.month()}
  //             onChange={e => onMonthSelect(month, e.target.value)}
  //           >
  //             {moment.months().map((label, value) => (
  //               <option value={value} key={value}>
  //                 {label}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //         <div>
  //           <select
  //             value={month.year()}
  //             onChange={e => onYearSelect(month, e.target.value)}
  //           >
  //             {years}
  //           </select>
  //         </div>
  //       </div>
  //     );
  //   };

  isOutsideRange = date =>
    isInclusivelyBeforeDay(date, this.props.dates.minDate) ||
    isInclusivelyAfterDay(date, this.props.dates.maxDate);
  // date.isBefore(this.props.dates.minDate) ||
  // date.isAfter(this.props.dates.maxDate);

  //   onDatesChange = ({ startDate, endDate }) => {
  //     echo("onDatesChange startDate: ", startDate, " endDate: ", endDate);
  //     this.setState({ startDate, endDate });
  //   };

  onFocusChange = focusedInput => this.setState({ focusedInput });

  onDatesChange = ({ startDate, endDate }) => {
    echo("onDatesChange startDate: ", startDate, " endDate: ", endDate);
    this.setState({ startDate, endDate });
  };
  //   componentDidUpdate(prevProps, prevState) {
  //     if (
  //       prevState.focusedInput !== this.state.focusedInput &&
  //       this.state.focusedInput === END_DATE
  //     ) {
  //       echo("End date is focused!"); // your code here
  //     }

  //     if (prevState.endDate !== this.state.endDate) {
  //       echo("End date is changed! ", this.state); // your code here
  //     }
  //   }
  onClose = params => {
    echo("onClose: ", params);
  };
  render() {
    echo("DatePicker render state: ", this.state);
    echo("DatePicker render props: ", this.props);
    // const { dates } = this.props;
    // const { startDate, endDate, focusedInput } = this.state;
    return (
      <div className="inline-block">
        <DateRangePicker
          //   renderMonthElement={this.renderMonthElement}x
          //   displayFormat="YYYY-MMM-DD"
          //   initialVisibleMonth={() => this.props.dates.presentDate}
          initialVisibleMonth={() => this.state.endDate}
          //   isOutsideRange={this.isOutsideRange}
          isOutsideRange={() => false}
          hideKeyboardShortcutsPanel
          minDate={this.props.dates.minDate}
          maxDate={this.props.dates.maxDate}
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          endDate={this.state.endDate}
          startDateId={START_DATE} // PropTypes.string.isRequired,
          endDateId={END_DATE} // PropTypes.string.isRequired,
          onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={this.onFocusChange}
          onClose={this.onClose}
        />
      </div>
    );
  }
}

export { DatePicker };
