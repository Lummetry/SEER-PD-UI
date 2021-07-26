import React, { useState, forwardRef } from "react";
import { Modal, ModalPosition, ModalDefaultClasses } from "components/ui/Modal";
import { CloseButton, Button } from "components/ui/Button";
import { Row, Column } from "components/ui/basic";
import { SelectProductsControl } from "./Control";
import Loader from "react-loader-spinner";

import { echo } from "components";

var cloneDeep = require("lodash.clonedeep");

export const SelectProductsModal = forwardRef(
  ({ onOkClick: customOnOkClick, ...propsToPass }, modalRef) => {
    let modal = modalRef.current;

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    let customClasses = cloneDeep(ModalDefaultClasses);
    customClasses.Overlay += " bg-gray-200 opacity-75";
    customClasses.Window += " mt-32 bg-white rounded-lg shadow-lg";

    const customMethods = ref => {
      return {
        setLoading: value => {
          setIsLoading(value);
        }
      };
    };

    let modalProperties = {
      // animation: animation,
      position: ModalPosition.Top.Center,
      classes: customClasses,
      parent: "modal-root",
      methods: customMethods,
      ...propsToPass // Pass props passed to the modal (e.g: onClose)
    };

    const onCancelClick = () => {
      modal.close({ button: "cancel" });
    };

    const defaultOnOkClick = () => {
      modal.close({ button: "ok", data: data });
    };

    let onOkClick = customOnOkClick || defaultOnOkClick;

    const onProductSelectorChange = newData => {
      setData(newData);
    };

    const onOpen = params => {
      echo("SelectProductsModal - onOpen - params: ", params);
      setData(params.data);
      return;
    };

    return (
      <Modal {...modalProperties} ref={modalRef} onOpen={onOpen}>
        <Column className="p-2">
          <Row className="pt-4 pl-4 pr-2 items-center justify-between">
            <div className="text-lg font-medium leading-relaxed">
              Select products
            </div>
            <CloseButton
              className="ml-8 p-3 items-center rounded hover:bg-gray-200"
              iconClassName="w-3 h-3"
              onClick={onCancelClick}
            />
          </Row>
          <div className="p-4">
            <SelectProductsControl
              onChange={onProductSelectorChange}
              data={data}
            />
          </div>
          <Row className="justify-center p-4">
            <Button
              onClick={() => {
                onOkClick(data);
              }}
              className="w-32 font-semibold"
            >
              OK
            </Button>
          </Row>
        </Column>
        {isLoading && (
          <div className="absolute top-0 left-0 bottom-0 right-0">
            <div className="w-full h-full bg-white opacity-50 flex justify-center items-center">
              <div className="w-8 h-8 inline-block">
                <Loader
                  type="Puff"
                  //type="ThreeDots"
                  color="#00BFFF"
                  height={30}
                  width={30}
                  timeout={0}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  }
);
