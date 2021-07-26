import React from "react";
import Downshift from "downshift";

class DropdownSingleDownshift extends React.Component {
  // Get selectedItem from props and pass it into state
  state = { selectedItem: this.props.selectedItem};

  stateReducer = (state, changes) => {
    // echo("DropdownSingleDownshift - changes: ", changes, " - state: ", state)
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
          var returnValue = 
            {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: false,
          // inputValue: ""
        };
        return returnValue;
      default:
        return changes;
    }
  };

  handleOnChange = (selectedItem, downshift) => {
      // echo("DropdownSingleSelect - new selection: ", selectedItem, " - downshift: ", downshift);
      if (this.props.onSelectionChanged) {
        this.props.onSelectionChanged(selectedItem);
      }
      this.setState({selectedItem: selectedItem});
  };

  handleUserAction = (
    options, stateAndHelpers) => {
      if (this.props.onUserAction) {
        this.props.onUserAction(options, stateAndHelpers)
      }
    }

  getStateAndHelpers(downshift) {
    const { selectedItem } = this.state;
    return {
      selectedItem,
      ...downshift
    };
  }
  render() {
    const { render, children = render,ref, ...props } = this.props;
    // TODO: compose together props (rather than overwriting them) like downshift does
    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleOnChange}
        onUserAction={this.handleUserAction}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}

export { DropdownSingleDownshift };
