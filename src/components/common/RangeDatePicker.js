import React from "react";
import classNames from "classnames";
import {
  InputGroup,
  DatePicker,
  InputGroupAddon,
  InputGroupText
} from "shards-react";

import "../../public/styles/range-date-picker.css";

class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props);

    const today = new Date();
    let fifteenDayAgo = new Date();
    fifteenDayAgo.setDate(today.getDate() - 15);

    this.state = {
      startDate: fifteenDayAgo,
      endDate: today
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  async handleStartDateChange(value) {
    await this.setState({
      startDate: new Date(value)
    });

    this.props.onDateChange(this.state.startDate, this.state.endDate)
  }

  async handleEndDateChange(value) {
    await this.setState({
      endDate: new Date(value) 
    });

    this.props.onDateChange(this.state.startDate, this.state.endDate)
  }

  render() {
    const { className } = this.props;
    const classes = classNames(className, "d-flex", "my-auto", "date-range");

    return (
      <InputGroup className={classes}>
        <DatePicker
          size="sm"
          selected={this.state.startDate}
          onChange={this.handleStartDateChange}
          placeholderText="Start Date"
          dropdownMode="select"
          className="text-center"
          dateFormat="dd-MM-yyyy"
          timezone='Asia/Ho_Chi_Minh'
        />
        <DatePicker
          size="sm"
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
          placeholderText="End Date"
          dropdownMode="select"
          className="text-center"
          timezone='Asia/Ho_Chi_Minh'
          dateFormat="dd-MM-yyyy"
        />
        <InputGroupAddon type="append">
          <InputGroupText>
            <i className="material-icons">&#xE916;</i>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

export default RangeDatePicker;
