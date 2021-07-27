import React, { useRef, useState } from "react";
import { echoFor } from "components";
import { PageView } from "components/ui/PageView";

import { useAppState } from "context/App";
import moment from "moment";

import { WizardStateProvider } from "components/ui/Wizard/context";
import { Home } from "./Home";
import { SelectProducts } from "./SelectProducts";
import { SelectLocations } from "./SelectLocations";
import { SelectParams } from "./SelectParams";
import {
  getDemandPatternForProductsAndLocations,
  getDemandPatternForLocationsAndProducts
} from "data/DemandPattern";

import { PatternsTable } from "./PatternsTable";
import { LoaderView } from "components/ui/LoaderView";
import { ModalParent } from "components/ui/Modal";

import { getMBRowsData } from "data";

export const Wizard = ({ name }) => {
  let echo = echoFor(`Wizard - ${name}`);
  const [
    {
      dates: appDates,
      steps: stepsFromState,
      sidebar: sidebarRef
    } /*,dispatch*/
  ] = useAppState();

  const wizard = useRef();
  const loaderView = useRef();
  const modalParent = useRef(null);

  let initialNumberofSteps = stepsFromState;
  const [numSteps, setNumSteps] = useState(initialNumberofSteps);
  const [historySize, setHistorySize] = useState(60);
  const initialStartDate = moment(appDates.presentDate)
    .subtract(stepsFromState, "days")
    .toDate();

  const [selectType, setSelectType] = useState("by-product");

  const initialEndDate = appDates.presentDate;

  const [dateRange, setDates] = useState([initialStartDate, initialEndDate]);

  const [productsAndLocations, setProductsAndLocations] = useState({
    selectedProducts: [],
    availableLocations: null,
    selectedLocations: null
  });

  const [locationsAndProducts, setLocationsAndProducts] = useState({
    selectedLocations: [],
    availableProducts: null,
    selectedProducts: null
  });

  const goSelectProducts = () => {
    echo("goSelectProducts");
    wizard.current.goTo([<SelectProducts />, { cheie: "valoare" }]);
  };

  const goHome = () => {
    setLocationsAndProducts({
      selectedLocations: [],
      availableProducts: null,
      selectedProducts: null
    });
    setProductsAndLocations({
      selectedProducts: [],
      availableLocations: null,
      selectedLocations: null
    });
    wizard.current.goTo([<Home />, {}]);
  };
  const goSelectParams = () => {
    wizard.current.goTo([<SelectParams />, {}]);
  };

  const goSelectLocations = () => {
    wizard.current.goTo([<SelectLocations />, { cheie: "valoare" }]);
  };

  const updateDates = newDatesArray => {
    echo("update dates: ", newDatesArray);
    const startDate = moment(newDatesArray[0]);
    const endDate = moment(newDatesArray[1]);
    const newSteps =
      endDate.endOf("day").diff(startDate.startOf("day"), "days") + 1;
    echo("new number of steps: ", newSteps);
    setNumSteps(newSteps);
    echo("Set new steps: ", newSteps);
    setDates(newDatesArray);
  };

  const updateSteps = newNumSteps => {
    echo("update steps: ", newNumSteps);
    setNumSteps(newNumSteps);
    const startDate = moment(dateRange[0]);
    echo("Start date is: ", startDate);
    const newEndDate = moment(startDate.toDate())
      .add(newNumSteps, "days")
      .toDate();

    echo("new end date: ", newEndDate);
    setDates([dateRange[0], newEndDate]);
  };

  const onParamsSelected = async () => {
    echo("onParamsSelected!");
    loaderView.current.isLoading = true;

    echo("Select type is: ", selectType);
    if (selectType === "by-product") {
      let products = productsAndLocations.selectedProducts;
      let locations = productsAndLocations.selectedLocations;
      let params = {
        products,
        locations,
        startDate: dateRange[0],
        steps: numSteps,
        historySize: historySize
      };
      echo("Params is: ", params);
      let {
        rowsData,
        seriesData
      } = await getDemandPatternForProductsAndLocations(params);
      echo("Got rows: ", rowsData);
      let mbRowsData = getMBRowsData(seriesData);
      loaderView.current.isLoading = false;
      wizard.current.goTo([
        <PatternsTable
          rows={rowsData}
          series={seriesData}
          mbRows={mbRowsData}
        />
      ]);
    } else {
      let products = locationsAndProducts.selectedProducts;
      let locations = locationsAndProducts.selectedLocations;
      let params = {
        locations,
        products,
        startDate: dateRange[0],
        steps: numSteps,
        historySize: historySize
      };
      echo("Params is: ", params);
      let {
        rowsData,
        seriesData
      } = await getDemandPatternForLocationsAndProducts(params);
      echo("Got rows: ", rowsData);
      let mbRowsData = getMBRowsData(seriesData);
      loaderView.current.isLoading = false;
      wizard.current.goTo([
        <PatternsTable
          rows={rowsData}
          series={seriesData}
          mbRows={mbRowsData}
        />
      ]);
    }
  };

  const onLocationsSelected = () => {
    echo("onLocationsSelected");
    wizard.current.goTo([<SelectParams />, {}]);
  };

  const onProductsSelected = () => {
    echo("onProductsSelected");
    wizard.current.goTo([<SelectParams />, {}]);
  };

  const onSelectByProduct = () => {
    setSelectType("by-product");
    sidebarRef.current.collapse();
    wizard.current.goTo([<SelectProducts />]);
  };

  const onSelectByLocation = () => {
    setSelectType("by-location");
    sidebarRef.current.collapse();
    wizard.current.goTo([<SelectLocations />]);
  };

  const state = {
    dates: [dateRange, setDates],
    steps: [numSteps, setNumSteps],
    productsAndLocations: [productsAndLocations, setProductsAndLocations],
    locationsAndProducts: [locationsAndProducts, setLocationsAndProducts],
    wizard: wizard,
    goSelectProducts: goSelectProducts,
    goSelectLocations: goSelectLocations,
    goSelectParams: goSelectParams,
    goHome: goHome,
    updateSteps: updateSteps,
    updateDates: updateDates,
    appDates: appDates,
    historySize: [historySize, setHistorySize],
    loaderView,
    modalParent,
    onParamsSelected,
    onLocationsSelected,
    onProductsSelected,
    onSelectByProduct,
    onSelectByLocation,
    selectType: [selectType, setSelectType]
  };

  return (
    <div className="relative h-full">
      <WizardStateProvider state={state}>
        <ModalParent ref={modalParent}>
          <LoaderView ref={loaderView}>
            <PageView ref={wizard} currentPage={[<Home />]} />
          </LoaderView>
        </ModalParent>
      </WizardStateProvider>
    </div>
  );
};
