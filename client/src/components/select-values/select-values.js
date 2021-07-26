import React, { useState, useEffect } from "react";

import { CheckTree } from "rsuite";

import { ChevronDownIcon } from "./ChevronDownIcon";

import { echo } from "components";

const valuesToText = values => {
  return values.join(".");
};

export function SelectValues(props) {
  const { className, alignType, ...rest } = props;
  const [isDisabled, setDisabled] = useState(
    props.disabled ? props.disabled : false
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(props.selectedValues);
  const [searchFilter, setSearchFilter] = useState("");

  const onOkClick = params => {
    setIsOpen(false);
    props.onOkClick && props.onOkClick(params);
  };

  useEffect(() => {
    //echo(props.name + " Search filter changed: ", searchFilter);
  }, [searchFilter]);

  const handleSelectionChanged = selection => {
    //echo(props.name + " Selection changed: ", selection);
    setSelectedValues(selection);
  };

  let dropDownContainerClassName = "absolute check-tree-container z-50 ";
  switch (alignType) {
    case "right":
      dropDownContainerClassName += " right-0 ";
      break;
    case "left":
      dropDownContainerClassName += " left-0 ";
      break;
    default:
      dropDownContainerClassName += " left-0 right-0 ";
  }
  return (
    <>
      <div
        className={"relative select-none " + (className ? className : " ")}
        style={props.style}
      >
        <div
          className={
            "border bg-white border-gray-300 rounded align-middle " +
            (isDisabled === false
              ? "transition-border hover:border-blue-400"
              : "")
          }
          // style={{ width: "280px" }}
          onClick={isDisabled === false ? () => setIsOpen(!isOpen) : null}
        >
          <div className="flex flex-row items-center cursor-pointer">
            <div className="m-2 flex flex-grow">
              {!selectedValues ||
                (selectedValues.length === 0 && (
                  <span>
                    {props.placeholder ? props.placeholder : "Select values"}
                  </span>
                ))}
              <span>
                <span>
                  {props.valuesToText
                    ? props.valuesToText(selectedValues)
                    : valuesToText(selectedValues)}
                </span>
              </span>
              <span className="selected-values overflow-hidden"></span>
            </div>
            <div className="w-2 h-2 m-2 flex-none">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
        {isOpen && (
          <div className={dropDownContainerClassName}>
            <div className="w-full p-2">
              <input
                className="outline-none w-full p-2 border border-gray-300 rounded"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search"
              ></input>
            </div>
            <div className="check-tree-parent">
              <CheckTree
                height={200}
                searchKeyword={searchFilter}
                virtualized
                defaultExpandAll
                data={props.values}
                value={selectedValues}
                onChange={handleSelectionChanged}
              />
            </div>
            <div className="-mt-4 pt-2 pb-2 pr-2 flex flex-row-reverse">
              <button
                className="lens-button"
                onClick={() =>
                  onOkClick({
                    reference: props.reference,
                    values: selectedValues
                  })
                }
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
