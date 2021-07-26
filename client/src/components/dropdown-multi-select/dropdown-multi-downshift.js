import React from "react";
import Downshift from "downshift";
import { echo } from "components";

class DropdownMultiDownshift extends React.Component {
  // Get selectedItems from props and pass it into state
  state = { selectedItems: this.props.selectedItems };

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        var returnValue = {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
          inputValue: ""
        };
        return returnValue;
      default:
        return changes;
    }
  };

  handleOnChange = (selectedItem, downshift) => {
    echo("handleOnChange - downshift: ", downshift);
    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem);
    } else {
      this.addSelectedItem(selectedItem);
    }
  };

  removeItem = (item, cb) => {
    const selectionChangedCb = () => {
      const { onSelectionChanged } = this.props;
      const { selectedItems } = this.state;
      if (onSelectionChanged) {
        onSelectionChanged(selectedItems);
      }
    };
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item)
      };
    }, selectionChangedCb);
  };
  addSelectedItem(item, cb) {
    const selectionChangedCb = () => {
      const { onSelectionChanged } = this.props;
      const { selectedItems } = this.state;
      if (onSelectionChanged) {
        onSelectionChanged(selectedItems);
      }
    };
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item]
      }),
      selectionChangedCb
    );
  }

  getRemoveButtonProps = ({ onClick, item, ...props } = {}) => {
    return {
      onClick: e => {
        // TODO: use something like downshift's composeEventHandlers utility instead
        onClick && onClick(e);
        e.stopPropagation();
        this.removeItem(item);
      },
      ...props
    };
  };

  getStateAndHelpers(downshift) {
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;
    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      ...downshift
    };
  }
  render() {
    const { render, children = render, ...props } = this.props;
    // TODO: compose together props (rather than overwriting them) like downshift does
    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleOnChange}
        selectedItem={null}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}

export { DropdownMultiDownshift };
