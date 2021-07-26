import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DropdownSingleDownshift } from "./dropdown-single-downshift";
import { echo } from "components";

function ArrowIcon({ isOpen }) {
  return (
    <svg
      className="fill-current w-4 h-4"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      stroke="currentColor"
      strokeWidth="0.5px"
      transform={isOpen ? "rotate(180)" : undefined}
    >
      {/* <path d="M1,6 L10,15 L19,6" /> */}
      <path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
      {/* <path xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" d="M4.516,7.548c0.436-0.446,1.043-0.481,1.576,0L10,11.295l3.908-3.747c0.533-0.481,1.141-0.446,1.574,0  c0.436,0.445,0.408,1.197,0,1.615c-0.406,0.418-4.695,4.502-4.695,4.502C10.57,13.888,10.285,14,10,14s-0.57-0.112-0.789-0.335  c0,0-4.287-4.084-4.695-4.502C4.107,8.745,4.08,7.993,4.516,7.548z"/> */}
    </svg>
  );
}
function LinesIcon() {
  return (
    <svg
      className="w-2 h-2 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M.69 11.331l1.363.338 1.026-1.611-1.95-.482a.904.904 0 10-.439 1.755zm17.791.261l-4.463 4.016-5.247-4.061a.905.905 0 00-.338-.162l-.698-.174-1.027 1.611 1.1.273 5.697 4.408a.915.915 0 001.168-.043l5.028-4.527a.9.9 0 00.064-1.277.912.912 0 00-1.284-.064zM8.684 7.18l4.887 3.129a.913.913 0 001.24-.246l5.027-7.242a.902.902 0 00-.231-1.26.91.91 0 00-1.265.23l-4.528 6.521-4.916-3.147a.915.915 0 00-.688-.123.914.914 0 00-.571.4L.142 17.209A.903.903 0 00.908 18.6a.908.908 0 00.768-.42l7.008-11z" />
    </svg>
  );
}

const ControllerButton = props => {
  const className =
    "flex-none focus:outline-none items-center justify-center h-full " +
    (props.isDisabled ? "disabled" : "");
  const { isDisabled, passOnProps } = props;
  return (
    <button disabled={isDisabled} className={className} {...passOnProps}>
      {props.children}
    </button>
  );
};

const renderDropDownTopArea = ({
  props,
  inputReference,
  isOpen,
  toggleMenu,
  getInputProps,
  selectedItem,
  inputValue,
  getToggleButtonProps
}) => {
  const { isDisabled } = props;
  // echo("renderDropdownTopArea - selectedItem: ", selectedItem);
  return (
    <div
      className={
        "cursor-pointer rounded bg-white border " +
        (!isDisabled ? "focus-within:border-blue-400 " : "")
        // (isOpen
        //   ? "rounded-br-none rounded-bl-none border-t border-r border-l "
        //   : "rounded-br-sm rounded-bl-sm border-t border-r border-l border-b ") +
        // ""
      }
      onClick={() => {
        if (isDisabled) return;
        if (!isOpen) {
          toggleMenu();
          return;
        }
        const inputFocused =
          document.activeElement ===
          ReactDOM.findDOMNode(inputReference.current);
        // Close
        if (inputFocused && isOpen) toggleMenu();
        // if (isOpen) {
        //   echo("inputReference este: ", inputReference);
        //   inputReference.current.focus();
        // }
      }}
    >
      <div className="flex items-center px-2 text-gray-600">
        <div className="">{props.renderIcon()}</div>
        <div
          className={
            "flex-grow text-sm mr-1 mt-1 mb-1 ml-2 " +
            (isOpen ? " hidden " : "")
          }
        >
          {selectedItem ? selectedItem : props.placeholderText}
        </div>
        <input
          disabled={isDisabled}
          className={
            "flex-grow border-none outline-none text-sm mr-1 mt-1 mb-1 ml-2 " +
            (!isDisabled ? " " : " disabled ") +
            (isOpen ? " " : "hidden ")
          }
          placeholder={props.placeholderText}
          {...getInputProps({
            ref: inputReference,
            onKeyDown(event) {
              if (event.key === "Backspace" && !inputValue) {
                // removeItem(selectedItems[selectedItems.length - 1]);
              }
            }
          })}
        />
        <ControllerButton
          isDisabled={isDisabled}
          {...getToggleButtonProps({
            // prevents the menu from immediately toggling
            // closed (due to our custom click handler above).
            onClick(event) {
              event.stopPropagation();
            }
          })}
        >
          <ArrowIcon isOpen={isOpen} />
        </ControllerButton>
      </div>
    </div>
  );
};

const Item = props => {
  const { isSelected, isActive, ...itemProps } = props;
  const className =
    "text-sm leading-relaxed pl-6 pr-2 pt-2 first:pt-0 pb-2 " +
    (isSelected ? "font-medium text-gray-800 " : "font-light text-gray-600 ") +
    (isActive ? "bg-gray-400 cursor-pointer " : "bg-white");
  return (
    <li className={className} {...itemProps}>
      {props.children}
    </li>
  );
};

const renderDropDownBottomArea = ({
  props,
  isOpen,
  getMenuProps,
  getItemProps,
  inputValue,
  highlightedIndex,
  selectedItem,
  filterItems
}) => {
  if (!props.allItems || props.allItems.length === 0) {
    return null;
  }
  const suggestions = filterItems(props.allItems, inputValue);
  // echo("Suggestions is: ", suggestions);
  if (suggestions.length === 0)
    return (
      <div className="mt-1 p-1 bg-white rounded border shadow-lg w-full">
        <p>No lines found for {inputValue}</p>
      </div>
    );
  return (
    <ul
      className={
        "mt-1 shadow-lg overflow-y-auto overflow-x-hidden bg-white rounded " +
        (isOpen ? "border" : "")
      }
      style={{ maxHeight: "20rem", width: "100%" }}
      {...getMenuProps()}
    >
      {isOpen
        ? suggestions.map((item, index) => {
            const downshiftProps = {
              ...getItemProps({
                item,
                index,
                isActive: highlightedIndex === index,
                isSelected: selectedItem === item
              })
            };
            const ourProps = {
              item: item,
              isActive: highlightedIndex === index,
              isSelected: selectedItem === item
            };
            if (props.renderItem !== undefined)
              return props.renderItem({ ...downshiftProps, ...ourProps });

            return (
              <Item key={index} {...downshiftProps}>
                {item}
              </Item>
            );
          })
        : null}
    </ul>
  );
};

const SimpleDropdownItem = props => {
  // echo("LocationDropdown item - props este: ", props)
  const { isSelected, isActive, ...passOnProps } = props;
  const className =
    "text-sm leading-relaxed pl-6 pr-2 pt-2 first:pt-0 pb-2 " +
    (isSelected ? "font-medium text-gray-800 " : "font-light text-gray-600 ") +
    (isActive ? "bg-gray-400 cursor-pointer " : "bg-white");
  return (
    <li className={className} key={props.id} {...passOnProps}>
      {props.item}
    </li>
  );
};

const filterArrayByValue = (items, inputValue) =>
  items.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));

class DropdownSingleSelect extends Component {
  constructor(props) {
    super(props);
    // echo("DropwdownSingleSelect constructor - props: ", props);
    this.state = {
      filterItems: props.filterItems,
      selectedItem: props.selectedItem
    };
    if (!this.state.filterItems) {
      this.state.filterItems = this.singleSelectFilter;
    }
    // echo("DropwdownSingleSelect constructor - state: ", this.state);
  }
  singleSelectFilter = (items, inputValue) => {
    if (inputValue && inputValue !== this.state.selectedItem) {
      return filterArrayByValue(items, inputValue);
    }
    return items;
  };

  static defaultProps = {
    renderItem: SimpleDropdownItem,
    filterItems: this.singleSelectFilter,
    renderIcon: LinesIcon,
    isDisabled: false
  };

  input = React.createRef();

  handleSelectionChanged = selectedItem => {
    // echo("DropdownSingleSelect - handleSelectionChanged - selectedItem: ", selectedItem, " - props: ", this.props)
    this.setState({ selectedItem: selectedItem });
    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(selectedItem);
    }
  };

  handleUserAction = (options, stateAndHelpers) => {
    if (options.isOpen) {
      this.input.current.focus();
    }
    if (this.props.onUserAction) {
      this.props.onUserAction(options, stateAndHelpers);
    } else {
      echo("User action!!! ", options, " stateAndHelpers: ", stateAndHelpers);
    }
  };

  clearSelection = () => {
    echo("Down shit current ", this.downshift);
    this.downshift.clearSelection();
  };

  openMenu = () => {
    echo("Open menu called: ", this.downshift);
    this.downshift.openMenu();
  };

  render() {
    // echo("DropdownSingleSelect render this: ", this);
    return (
      <DropdownSingleDownshift
        onSelectionChanged={this.handleSelectionChanged}
        onUserAction={this.handleUserAction}
        selectedItem={this.state.selectedItem}
      >
        {downshiftProps => {
          const {
            getInputProps,
            getToggleButtonProps,
            getMenuProps,
            isOpen,
            inputValue,
            selectedItem,
            getItemProps,
            highlightedIndex,
            toggleMenu
          } = downshiftProps;
          this.downshift = downshiftProps;
          // echo(
          //   "DropdownSingleSelect render - downshiftProps este: ",
          //   downshiftProps
          // );
          return (
            <div className="relative">
              {renderDropDownTopArea({
                props: this.props,
                inputReference: this.input,
                isOpen,
                toggleMenu,
                getInputProps,
                selectedItem,
                inputValue,
                getToggleButtonProps
              })}
              <div className="absolute w-full h-auto z-50">
                {renderDropDownBottomArea({
                  props: this.props,
                  filterItems: this.state.filterItems,
                  isOpen,
                  getMenuProps,
                  getItemProps,
                  inputValue,
                  highlightedIndex,
                  selectedItem
                })}
              </div>
            </div>
          );
        }}
      </DropdownSingleDownshift>
    );
  }
}

export { DropdownSingleSelect };
