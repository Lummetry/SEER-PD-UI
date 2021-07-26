import React, { useState, useEffect, useRef } from "react";
import { CloseButton, Button } from "components/ui/Button";
import { Row, Column } from "components/ui/basic";
import { ProductName, LocationName } from "components/ui";

import { echoFor } from "components";
import { LoaderView } from "components/ui/LoaderView";
import { getSettings, saveSettings } from "data/Settings";

export const EditConfigModal = ({ modal, ...params }) => {
  let echo = echoFor("EditConfigModal");

  let {
    product,
    location,
    initialStock: initialStockStart,
    leadTime: leadTimeStart
  } = params;

  echo("params: ", params);
  const [initialStock, setInitialStock] = useState(initialStockStart);
  const [leadTime, setLeadTime] = useState(leadTimeStart);

  const loaderView = useRef();

  const onClose = params => {
    // return {
    //   canClose: false
    // };
  };

  useEffect(() => {
    echo("Input in constructor: ", params);
    // setInitialStock(initialStockStart + 10);
    modal.current.onClose = onClose;
  }, []);

  const onCancelClick = () => {
    modal.current.cancel();
  };

  const onOkClick = () => {
    loaderView.current.isLoading = true;
    echo("initial stock start is: ", initialStockStart);
    if (initialStock === initialStockStart && leadTime === leadTimeStart) {
      echo("values not changed - cancel");
      modal.current.cancel();
      return;
    }
    modal.current.submit({
      product,
      location,
      initialStock: parseInt(initialStock),
      leadTime: parseInt(leadTime)
    });
  };

  const onLoaderViewClick = () => {
    loaderView.current.isLoading = false;
  };
  return (
    <LoaderView ref={loaderView} onClick={onLoaderViewClick}>
      <Column className="p-4" style={{ maxWidth: "30rem" }}>
        <Row className="py-2 pl-2 pr-2 items-center justify-between">
          <div className="text-lg font-semibold leading-relaxed">
            Edit Product
          </div>
          <CloseButton
            className="ml-8 p-3 items-center rounded hover:bg-gray-200"
            iconClassName="w-3 h-3"
            onClick={onCancelClick}
          />
        </Row>
        <Column className="p-4">
          <Row className="py-2">
            <ProductName id={product} />
          </Row>
          <Row className="py-2">
            <LocationName id={location} />
          </Row>
          <Row className="justify-between items-center mt-2">
            <span className="font-semibold text-base mr-4">Initial stock</span>{" "}
            <input
              className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16"
              value={initialStock}
              onChange={e => setInitialStock(e.target.value)}
            />
          </Row>
          <Row className="justify-between items-center mt-2">
            <span className="font-semibold text-base mr-4">Lead time</span>{" "}
            <input
              className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16"
              value={leadTime}
              onChange={e => setLeadTime(e.target.value)}
            />
          </Row>
        </Column>
        <Row className="justify-center p-2 mt-2">
          <Button onClick={onOkClick} className="w-32 font-semibold">
            OK
          </Button>
        </Row>
      </Column>
    </LoaderView>
  );
};

export const EditDefaultValues = ({ modal, ...params }) => {
  let echo = echoFor("EditDefaultValues");

  let {
    product,
    location,
    initialStock: initialStockStart,
    leadTime: leadTimeStart
  } = params;

  echo("params: ", params);
  const [initialStock, setInitialStock] = useState(0);
  const [leadTime, setLeadTime] = useState(0);

  const loaderView = useRef();

  const onClose = params => {
    // return {
    //   canClose: false
    // };
  };

  const getDefaults = async () => {
    let defaults = await getSettings([
      "default_lead_time",
      "default_initial_stock"
    ]);
    echo("defaults is: ", defaults);

    let default_lead_time = parseInt(defaults["default_lead_time"]);
    let default_initial_stock = parseInt(defaults["default_initial_stock"]);
    setInitialStock(default_initial_stock);
    setLeadTime(default_lead_time);
  };

  useEffect(() => {
    async function callGetDefaults() {
      await getDefaults();
    }
    callGetDefaults();
  }, []);

  const onCancelClick = () => {
    modal.current.cancel();
  };

  const onOkClick = () => {
    saveSettings({
      default_lead_time: leadTime,
      default_initial_stock: initialStock
    });
    loaderView.current.isLoading = true;
    echo("initial stock start is: ", initialStockStart);
    if (initialStock === initialStockStart && leadTime === leadTimeStart) {
      echo("values not changed - cancel");
      modal.current.cancel();
      return;
    }
    modal.current.submit({
      product,
      location,
      initialStock: parseInt(initialStock),
      leadTime: parseInt(leadTime)
    });
  };

  const onLoaderViewClick = () => {
    loaderView.current.isLoading = false;
  };
  return (
    <LoaderView ref={loaderView} onClick={onLoaderViewClick}>
      <Column className="p-4" style={{ maxWidth: "30rem" }}>
        <Row className="py-2 pl-2 pr-2 items-center justify-between">
          <div className="text-lg font-semibold leading-relaxed">
            Default Settings
          </div>
          <CloseButton
            className="ml-8 p-3 items-center rounded hover:bg-gray-200"
            iconClassName="w-3 h-3"
            onClick={onCancelClick}
          />
        </Row>
        <Column className="p-4">
          <Row className="justify-between items-center mt-2">
            <span className="font-semibold text-base mr-4">Initial stock</span>{" "}
            <input
              className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16"
              value={initialStock}
              onChange={e => setInitialStock(e.target.value)}
            />
          </Row>
          <Row className="justify-between items-center mt-2">
            <span className="font-semibold text-base mr-4">Lead time</span>{" "}
            <input
              className="px-2 py-1 border border-blue-300 bg-white rounded outline-none w-16"
              value={leadTime}
              onChange={e => setLeadTime(e.target.value)}
            />
          </Row>
        </Column>
        <Row className="justify-center p-2 mt-2">
          <Button onClick={onOkClick} className="w-32 font-semibold">
            OK
          </Button>
        </Row>
      </Column>
    </LoaderView>
  );
};
