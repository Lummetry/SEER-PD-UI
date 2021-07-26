import React, { useState, useRef } from "react";

import SwipeableViews from "react-swipeable-views";

import { Column, Row, TopLeft } from "components/ui/basic";
import { Button, ButtonKind } from "components/ui/Button";
import { SelectProductsModal } from "../SelectProducts/Modal";
import { echo, echoFor } from "components";
import { OutOfStockModal } from "screens/OutOfStock/Modal";

import { sampleResponse } from "data/sample";

import { getSeriesForProductsAndLocationsPromise, getSeriesData } from "data";

import { getOutOfStockData } from "data/OutOfStock";

import moment from "moment";

import { useAppState } from "context/App";
import { OutOfStockTable } from "screens/OutOfStock/Table";
import { ChevronRight2Icon } from "components/ui/Icons";

const styles = {
  root: {
    height: "100%"
  },
  container: {
    height: "100%"
  }
};

export const BillOfQuantity = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [productsAndLocations, setProductsAndLocations] = useState({
    selectedProducts: [],
    availableLocations: null,
    selectedLocations: null
  });

  let echo = echoFor("BillOfQuantity");

  const selectProductsModal = useRef();
  const outOfStockModal = useRef();
  const [loading, setIsLoading] = useState(false);
  const appState = useAppState();
  const [
    { dates, steps: stepsFromState, sidebar: sidebarRef },
    dispatch
  ] = appState;

  const initialStartDate = moment(dates.presentDate)
    .subtract(stepsFromState, "days")
    .toDate();
  const initialEndDate = dates.presentDate;
  const [dateRange, setDateRange] = useState([
    initialStartDate,
    initialEndDate
  ]);

  const [steps, setSteps] = useState(stepsFromState);

  const [outOfStockData, setOutOfStockData] = useState(null);

  const goForward = () => {
    echo("Going forward, sidebarRef: ", sidebarRef);
    if (tabIndex < 3 - 1) {
      sidebarRef.current.collapse();
      setTabIndex(tabIndex + 1);
    }
  };

  const goBack = () => {
    echo("Going back");
    setOutOfStockData(null);
    if (tabIndex >= 1) {
      sidebarRef.current.expand();
      setTabIndex(tabIndex - 1);
    }
  };

  const openSelectProductsModal = () => {
    selectProductsModal.current.open({ data: productsAndLocations });
  };

  const selectProductsOnClose = closeParams => {
    let modal = selectProductsModal.current;
    modal.setLoading(false);
    if (closeParams.button && closeParams.button === "ok") {
      return;
    }

    echo("selectProductsModal closed - params: ", closeParams);
    // // if (!closeParams.data) {
    // //   return;
    // // }
    // // if (closeParams.data.selectedProducts.length < 1) {
    // //  echo("Products not selected");
    // //   return;
    // // }
    // // setProductsAndLocations(closeParams.data);
    // // showBillOfQuantity(closeParams.data);
    // // goForward();
  };

  const selectProductsOnOkClick = data => {
    echo("selectProductsOnOkClick - data: ", data);
    // Comment this if you want to select new products when hiting the back button
    setProductsAndLocations(data);
    showBillOfQuantity(data);
  };

  let allSelectedSeries = [];
  const showBillOfQuantity = async data => {
    let echo = echoFor("showBillOfQuantity");
    echo("productsAndLocations: ", data);
    let modal = selectProductsModal.current;

    let selectedProducts = data.selectedProducts;
    if (selectedProducts.length === 0) {
      echo("no selected products");
      return;
    }
    modal.setLoading(true);
    let allPromises = [];
    selectedProducts.forEach((selectedProduct, index) => {
      let selectedLocations = data.selectedLocations[selectedProduct];
      echo("product: ", selectedProduct, " - locations: ", selectedLocations);
      const currentPromise = getSeriesForProductsAndLocationsPromise(
        [selectedProduct],
        selectedLocations
      );
      echo("Returned series: ", currentPromise);
      allPromises.push(currentPromise);
    });
    let allSelectedSeries = [];
    await Promise.all(allPromises).then(function(values) {
      values.forEach(value => {
        allSelectedSeries.push(...value.data);
      });
    });

    echo("All series: ", allSelectedSeries);
    let series = allSelectedSeries.map(x => x.series);

    echo("Series: ", series);

    const seriesData = await getSeriesData(
      series,
      moment(dateRange[0]).format(`YYYY-MM-DD`),
      steps
    );
    // const seriesData = sampleResponse;
    echo("Series data: ", seriesData);
    let outOfStockData = getOutOfStockData(
      series,
      seriesData,
      allSelectedSeries,
      steps,
      dateRange[0]
    );
    setOutOfStockData(outOfStockData);
    modal.setLoading(false);
    modal.hide();
    goForward();
    // setIsLoading(false);
  };

  const onOOSTableRowClick = async row => {
    echo("Clicked on row:", row);
    outOfStockModal.current.open({ data: outOfStockData, index: row.index });
  };

  return (
    <SwipeableViews
      index={tabIndex}
      style={styles.root}
      containerStyle={styles.container}
      springConfig={{
        duration: "0.2s",
        easeFunction: "cubic-bezier(0.15, 0.3, 0.25, 1)",
        delay: "0s"
      }}
      slideClassName=""
    >
      <Column className="swipeable-view relative h-full max-h-full bg-gray-100">
        <Row className="mt-20 justify-center">
          <Column>
            <p className="font-bold text-2xl p-4 self-center">
              Bill of Quantity
            </p>
            <p className="font-medium text-base p-4 self-center text-center">
              Start by selecting products to find out more.
              <br /> Click below to get started.
            </p>
            <Row className="justify-center pt-4">
              <Button kind={ButtonKind.White} onClick={openSelectProductsModal}>
                Select Products
              </Button>
            </Row>
          </Column>
        </Row>
        <SelectProductsModal
          ref={selectProductsModal}
          onClose={selectProductsOnClose}
          onOkClick={selectProductsOnOkClick}
        />
      </Column>
      <Column className="swipeable-view h-full max-h-full">
        <div className="bg-white h-16 p-3 border-b border border-gray-200 items-center flex flex-none">
          <Row className="items-center">
            <Button kind={ButtonKind.Transparent} onClick={() => goBack()}>
              <div className="w-6 h-6">
                <ChevronRight2Icon />
              </div>
            </Button>
            <div className="font-medium text-lg select-none">
              Bill of Quantity
            </div>
          </Row>
        </div>
        <div className="overflow-hidden" style={{ maxHeight: "100%" }}>
          {outOfStockData && (
            <div className="max-h-full overflow-scroll p-2">
              {/* <OutOfStockList data={outOfStockData} /> */}
              <OutOfStockTable
                data={outOfStockData}
                onRowClick={onOOSTableRowClick}
              />
              <OutOfStockModal ref={outOfStockModal} />
            </div>
          )}
        </div>
      </Column>
    </SwipeableViews>
  );
};
