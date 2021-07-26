import React, { useState, useRef, useEffect } from "react";
import { ModalDefaultClasses } from "components/ui/Modal";
import { CloseButton, Button } from "components/ui/Button";
import { Row, Column } from "components/ui/basic";
import { getSeriesForProductsAndLocations } from "data";
import { getConfigsList, getConfigsListRows } from "data/SeriesConfig";
import { ProductConfigTable } from "./Table";

import { echoFor } from "components";
import { EditConfigModal } from "./EditProductConfig";
import { ModalParent, showModal } from "components/ui/Modal";
import { LoaderView } from "components/ui/LoaderView";

var cloneDeep = require("lodash.clonedeep");

export const ProductConfigModal = ({ modal, ...params }) => {
  let echo = echoFor("ProductConfigModal");
  echo("render");

  const loaderView = useRef();
  const [tableData, setTableData] = useState(null);
  const modalParent = useRef(null);

  let customClasses = cloneDeep(ModalDefaultClasses);
  // customClasses.Contents += " bg-white rounded-lg shadow-lg";
  customClasses.Overlay += " bg-gray-200 opacity-75";
  // customClasses.Window += " mt-3";
  // " left-0 right-0 mx-10 mt-10 mb-10 top-0 bottom-0 bg-white rounded-lg shadow-lg overflow-hidden";

  const onCancelClick = () => {
    modal.current.cancel();
  };

  let onOkClick = () => {
    echo("onOkClick");
    modal.current.submit({});
  };

  const onOpen = async () => {
    echo("onOpen - params: ", params);
    loaderView.current.isLoading = true;
    var configData = await getConfigsList();
    // var configData = await getSeriesForProductsAndLocations(
    //   products,
    //   locations
    // );

    echo("Returned config data: ", configData);

    var tableDataLocal = getConfigsListRows(configData);
    echo("Table data: ", tableDataLocal);

    setTableData(tableDataLocal);
    echo("Am apelat setTableData");
    loaderView.current.isLoading = false;
    // onRowClick(0);
    return;
  };

  useEffect(() => {
    async function callOnOpen() {
      await onOpen();
    }
    callOnOpen();
  }, []);

  const onRowClick = async row => {
    echo("Clicked on row: ", row);

    showModal(EditConfigModal, modalParent, {
      params: {
        pentru_input: "o valoare"
      },
      on: {
        submit: result => {
          echo("EditConfigModal submit result: ", result);
        }
      }
    });
  };

  echo("Table data: ", tableData);

  return (
    <ModalParent ref={modalParent}>
      <LoaderView ref={loaderView}>
        <Column className="p-4 " style={{ maxWidth: "30rem" }}>
          <Row className="py-2 items-center justify-between">
            <div className="text-lg font-semibold leading-relaxed">
              Settings
            </div>
            <CloseButton
              className="ml-8 p-3 items-center rounded hover:bg-gray-200"
              iconClassName="w-3 h-3"
              onClick={onCancelClick}
            />
          </Row>
          {/* {tableData && (
            <>
              <ProductConfigTable
                rowsData={tableData}
                onRowClick={onRowClick}
              />
            </>
          )} */}
          <Row className="justify-center p-4">
            <Button onClick={onOkClick} className="w-32 font-semibold">
              OK
            </Button>
          </Row>
        </Column>
      </LoaderView>
    </ModalParent>
  );
};
