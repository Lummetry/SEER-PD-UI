import React from "react";
import { DropdownMultiDownshift } from "./dropdown-multi-downshift";
import { echo } from "components";

function ArrowIcon({ isOpen }) {
  return (
    <svg
      className="fill-current w-4 stroke-current"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      stroke="#a0aec0"
      strokeWidth="0.5px"
      transform={isOpen ? "rotate(180)" : undefined}
    >
      {/* <path d="M1,6 L10,15 L19,6" /> */}
      <path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" />
      {/* <path xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" d="M4.516,7.548c0.436-0.446,1.043-0.481,1.576,0L10,11.295l3.908-3.747c0.533-0.481,1.141-0.446,1.574,0  c0.436,0.445,0.408,1.197,0,1.615c-0.406,0.418-4.695,4.502-4.695,4.502C10.57,13.888,10.285,14,10,14s-0.57-0.112-0.789-0.335  c0,0-4.287-4.084-4.695-4.502C4.107,8.745,4.08,7.993,4.516,7.548z"/> */}
    </svg>
  );
}

const ControllerButton = props => {
  const className =
    "flex-none focus:outline-none items-center justify-center h-full";
  return <button className={className} {...props} />;
};

function LinesIcon() {
  return (
    <svg
      className="fill-current w-3 stroke-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 14"
    >
      <g fill="none" fillRule="evenodd">
        <path d="M-2-5h24v24H-2z" />
        <path
          fill="currentColor"
          d="M1.5 13.49l6-6.01 4 4L20 1.92 18.59.51 11.5 8.48l-4-4L0 11.99z"
        />
      </g>
    </svg>
  );
}

const renderDropDownTopArea = ({
  props,
  inputReference,
  isOpen,
  toggleMenu,
  getInputProps,
  removeItem,
  selectedItems,
  inputValue,
  getToggleButtonProps
}) => {
  return (
    <div
      className={
        "cursor-pointer rounded bg-white focus-within:border-blue-400 border"
        // (isOpen
        //   ? "rounded-br-none rounded-bl-none border-t border-r border-l "
        //   : "rounded-br-sm rounded-bl-sm border-t border-r border-l border-b ") +
        // ""
      }
      onClick={() => {
        toggleMenu();
        if (isOpen) {
          inputReference.current.focus();
        }
      }}
    >
      <div className="flex items-center px-2 text-gray-600">
        <div>{props.renderIcon()}</div>
        <input
          className="border-none w-full outline-none text-sm ml-2 text-gray-700 mr-1 mt-1 mb-1"
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
  selectedItems
}) => {
  if (!props.allItems) {
    return null;
  }
  const suggestionsBest = props.filterItems(props.allItems.best, inputValue);

  const suggestionsOthers = props.filterItems(
    props.allItems.others,
    inputValue
  );
  if (suggestionsOthers.length === 0 && suggestionsBest.length === 0)
    return (
      <div className="absolute mt-1 p-1 bg-white rounded border shadow-lg w-full">
        <p>No lines found for {inputValue}</p>
      </div>
    );
  return (
    <>
      <ul
        className={
          "mt-1 shadow-lg overflow-y-auto overflow-x-hidden bg-white rounded " +
          (isOpen ? "border" : "")
        }
        style={{ maxHeight: "18rem", width: "100%" }}
        {...getMenuProps()}
      >
        {isOpen && suggestionsBest.length !== 0 && (
          <div className="p-2 font-medium">Best</div>
        )}
        {isOpen
          ? suggestionsBest.map((item, index) => {
              return (
                <Item
                  key={index}
                  {...getItemProps({
                    item,
                    index,
                    isActive: highlightedIndex === index,
                    isSelected: selectedItems.includes(item)
                  })}
                >
                  {item}
                  {/* {props.allItems[item].desc} ({item}) */}
                </Item>
              );
            })
          : null}
        {isOpen && suggestionsOthers.length !== 0 && (
          <div className="p-2 font-medium">Everything else</div>
        )}
        {isOpen
          ? suggestionsOthers.map((item, index) => {
              let newIndex = index + suggestionsBest.length;
              return (
                <Item
                  key={newIndex}
                  {...getItemProps({
                    item,
                    index: newIndex,
                    isActive: highlightedIndex === newIndex,
                    isSelected: selectedItems.includes(item)
                  })}
                >
                  {item}
                  {/* {props.allItems[item].desc} ({item}) */}
                </Item>
              );
            })
          : null}
      </ul>
    </>
  );
};

// const getSuggestions = (inputValue, itemList) =>
//   Array.from(itemList.keys()).filter(item =>
//     item.toLowerCase().includes(inputValue.toLowerCase())
//   );

const filterMapByValue = (items, inputValue) => {
  return Object.keys(items).filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );
};

class DropdownMultiSelect extends React.Component {
  static defaultProps = {
    placeholderText: "Pick lines",
    filterItems: filterMapByValue,
    renderIcon: LinesIcon
  };
  input = React.createRef();
  downshift = React.createRef();
  handleSelectionChanged = selectedItems => {
    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(selectedItems);
    }
  };
  removeItem = item => {
    echo("In MultiSelectDropdown removeItem: downshift: ", this.downshift);
    this.downshift.current.removeItem(item);
  };
  render() {
    // const { allItems } = this.props;
    return (
      <DropdownMultiDownshift
        ref={this.downshift}
        onSelectionChanged={this.handleSelectionChanged}
        selectedItems={this.props.selectedItems}
      >
        {({
          getInputProps,
          getToggleButtonProps,
          getMenuProps,
          // note that the getRemoveButtonProps prop getter and the removeItem
          // action are coming from MultiDownshift composibility for the win!
          getRemoveButtonProps,
          removeItem,
          isOpen,
          inputValue,
          selectedItems,
          getItemProps,
          highlightedIndex,
          toggleMenu
        }) => (
          <div className="relative">
            {renderDropDownTopArea({
              props: this.props,
              inputReference: this.input,
              isOpen,
              toggleMenu,
              getInputProps,
              removeItem,
              selectedItems,
              inputValue,
              getToggleButtonProps
            })}
            <div className="absolute w-full h-auto z-50">
              {renderDropDownBottomArea({
                props: this.props,
                isOpen,
                getMenuProps,
                getItemProps,
                inputValue,
                highlightedIndex,
                selectedItems
              })}
            </div>
          </div>
        )}
      </DropdownMultiDownshift>
    );
  }
}

export { DropdownMultiSelect };
