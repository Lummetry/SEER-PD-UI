import React, { useState, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import Loader from "react-loader-spinner";
import { LensTable } from "./Table";

import { Column, Row, TopLeft } from "components/ui/basic";
import { Button, ButtonKind } from "components/ui/Button";
import { SelectProductsModal } from "../SelectProducts/Modal";
import { SeriesGraphModal } from "screens/ProductPatterns/SeriesGraph/Modal";
import { echo } from "components";
import moment from "moment";
import { useAppState } from "context/App";

import {
  getSeriesData,
  getSeriesForProductsAndLocationsPromise,
  getRowsData,
  getMBRowsData,
  getBestBaselines
} from "data";

const styles = {
  root: {
    height: "100%"
  },
  container: {
    height: "100%"
  }
};

export const ProductPatterns = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [productsAndLocations, setProductsAndLocations] = useState({
    selectedProducts: [],
    availableLocations: null,
    selectedLocations: null
  });

  const goForward = () => {
    echo("Going forward");
    if (tabIndex < 3 - 1) {
      setTabIndex(tabIndex + 1);
    }
  };

  const goBack = () => {
    echo("Going back");
    if (tabIndex >= 1) {
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
    showProductPatterns(data);
  };

  // const onSelectProductsClose = closeParams => {
  //   echo("selectProductsModal closed - params: ", closeParams);
  //   if (!closeParams.data) {
  //     return;
  //   }
  //   if (closeParams.data.selectedProducts.length < 1) {
  //     echo("Products not selected");
  //     return;
  //   }
  //   setProductsAndLocations(closeParams.data);
  //   showProductPatterns(closeParams.data);
  //   goForward();
  // };

  const selectProductsModal = useRef();
  const seriesGraphModal = useRef();

  const [bestBaselines, setBestBaselines] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [{ dates, steps: stepsFromState }, dispatch] = useAppState();
  const initialStartDate = moment(dates.presentDate)
    .subtract(stepsFromState, "days")
    .toDate();
  const initialEndDate = dates.presentDate;
  const [dateRange, setDateRange] = useState([
    initialStartDate,
    initialEndDate
  ]);

  const [steps, setSteps] = useState(stepsFromState);
  const [data, setData] = useState({
    rows: null,
    mbRows: null,
    series: null
  });
  const [currentRow, setCurrentRow] = useState(null);

  const showProductPatterns = async data => {
    echo("Show product patterns - productsAndLocations: ", data);
    let modal = selectProductsModal.current;

    let selectedProducts = data.selectedProducts;
    if (selectedProducts.length === 0) {
      echo("showBillOfQuantity - no selected products");
      return;
    }
    modal.setLoading(true);
    let allPromises = [];
    selectedProducts.forEach((selectedProduct, index) => {
      let selectedLocations = data.selectedLocations[selectedProduct];
      echo(
        "Show product patterns - product: ",
        selectedProduct,
        " - locations: ",
        selectedLocations
      );
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
    let rowsData = getRowsData(
      series,
      seriesData,
      allSelectedSeries,
      steps,
      dateRange[0]
    );
    let mbRowsData = getMBRowsData(seriesData);
    setData({ rows: rowsData, series: seriesData, mbRows: mbRowsData });
    modal.setLoading(false);
    modal.hide();
    goForward();
  };

  const honTableRowClick = async row => {
    echo("onTableRowClick - ", row);
    let seriesID = parseInt(row.original.series);
    let bestBaselines = await getBestBaselines(
      [seriesID],
      moment(dateRange[0]).format(`YYYY-MM-DD`),
      steps
    );
    echo("Best baselines: ", bestBaselines);

    seriesGraphModal.current.open({
      row: row.original,
      seriesData: data.series,
      bestBaselines,
      startDate: dateRange[0]
    });

    // setBestBaselines(bestBaselines);
    // setGraphModalVisible(true);
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
              Identify and analyze product patterns
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
      <Column className="swipeable-view relative h-full max-h-full">
        <Row className="justify-center mt-4 text-lg font-medium">
          <div>Product Patterns</div>
        </Row>
        <div className="pt-5 px-5 max-w-full max-h-full">
          {data.rows && (
            <>
              <LensTable
                data={data.rows}
                onRowClick={honTableRowClick}
              ></LensTable>
            </>
          )}
          {/* {data.mbRows && (
            <div className="mt-4 mb-4">
              <MBTable
                data={data.mbRows}
                // onRowClick={honTableRowClick}
              ></MBTable>
            </div>
          )} */}
        </div>
        <TopLeft className="mt-4 ml-4">
          <Button onClick={() => goBack()}>Go Back</Button>
        </TopLeft>
        <SeriesGraphModal ref={seriesGraphModal} />
      </Column>
    </SwipeableViews>
  );
};
