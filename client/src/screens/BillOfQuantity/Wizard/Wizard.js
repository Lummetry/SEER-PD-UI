import React, { useRef, useState } from "react";

import { echoFor } from "components";
import { PageView } from "components/ui/PageView";

import { useAppState } from "context/App";
import moment from "moment";

import { WizardStateProvider } from "components/ui/Wizard/context";
import { Home } from "./Home";
import { SelectLocations } from "./SelectLocations";
import { LoaderView } from "components/ui/LoaderView";
import { getSeriesForLocationsAndProducts } from "./Data/series";

import { getSettings } from "data/Settings";
import { addConfigsToSeries, groupBySeries } from "data/SeriesConfig";
import { ConfigProducts } from "screens/BillOfQuantity/Wizard/ConfigProducts";
import { ModalParent } from "components/ui/Modal";
import { SelectParams } from "./SelectParams";

import { getOutOfStockData2 } from "data/OutOfStock";
import { BoQReport } from "./BoQReport";
import { ReviewColumns } from "./ReviewColumns";

import { getSeriesData } from "data";
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
  const [historySize, setHistorySize] = useState(14);

  const initialStartDate = moment(appDates.presentDate)
    .subtract(stepsFromState, "days")
    .toDate();

  const initialEndDate = appDates.presentDate;

  const [dateRange, setDates] = useState([initialStartDate, initialEndDate]);

  const [locationsAndProducts, setLocationsAndProducts] = useState({
    // selectedLocations: [0, 2],
    selectedLocations: [],
    availableProducts: null,
    selectedProducts: null
    // selectedProducts: {
    //   0: [402, 412],
    //   2: [3879]
    // }
  });

  const [seriesWithConfig, setSeriesWithConfig] = useState(null);

  const goHome = () => {
    setLocationsAndProducts({
      selectedLocations: [],
      availableProducts: null,
      selectedProducts: null
    });
    setSeriesWithConfig(null);
    wizard.current.goTo([<Home />]);
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

  const onColumnsReviewContinue = async () => {
    echo("onParamsSelected!");
    loaderView.current.isLoading = true;

    let seriesIDs = seriesWithConfig.map(value => value.series);
    echo("series IDs is: ", seriesIDs);

    echo("Series with config is", seriesWithConfig);

    const seriesData = await getSeriesData(
      seriesIDs,
      moment(dateRange[0]).format(`YYYY-MM-DD`),
      numSteps,
      historySize
    );

    loaderView.current.isLoading = false;
    // echo("Series data: ", seriesData);
    echo("Done getting series");
    const seriesWithConfigGrouped = groupBySeries(seriesWithConfig);
    echo("seriesWithConfigGrouped: ", seriesWithConfigGrouped);

    let outOfStockData = getOutOfStockData2(
      seriesWithConfig,
      seriesData,
      seriesWithConfigGrouped,
      numSteps,
      dateRange[0]
    );

    echo("outOfStockData is: ", outOfStockData);

    wizard.current.goTo([<BoQReport outOfStockData={outOfStockData} />]);

    // const seriesData = sampleResponse;
    // echo("Series data: ", seriesData);
    // loaderView.current.isLoading = true;

    // let products = productsAndLocations.selectedProducts;
    // let locations = productsAndLocations.selectedLocations;
    // let params = {
    //   products,
    //   locations,
    //   startDate: dateRange[0],
    //   steps: numSteps,
    //   historySize: historySize
    // };
    // echo("Params is: ", params);
    // let {
    //   rowsData,
    //   seriesData
    // } = await getDemandPatternForProductsAndLocations(params);
    // echo("Got rows: ", rowsData);
    // loaderView.current.isLoading = false;
    // wizard.current.goTo([<BoQReport rows={rowsData} series={seriesData} />]);
    // let selectedProducts = productsAndLocations.selectedProducts;
  };

  const onConfigProductsComplete = async () => {
    let echo = echoFor("onConfigProductsComplete");
    wizard.current.goTo([<SelectParams />, {}]);
  };
  const onLocationsSelected = async () => {
    let echo = echoFor("onLocationsSelected");
    echo("locationsAndProducts: ", locationsAndProducts);
    let { selectedLocations, selectedProducts } = locationsAndProducts;
    let series = await getSeriesForLocationsAndProducts(
      selectedLocations,
      selectedProducts
    );
    echo("series: ", series);
    await addConfigsToSeries(series);
    echo("series after adding configs:", series);

    setSeriesWithConfig(series);
    const grouped = groupBySeries(series);
    echo("Grouped by series: ", grouped);
    wizard.current.goTo([<ConfigProducts />]);

    // let settings = await getSettings(["o_setare", "alta_setare"]);
    // echo("Got settings: ", settings);
    // wizard.current.goTo([<SelectProducts />]);
  };

  const onHomeContinue = () => {
    wizard.current.goTo([<SelectLocations />, {}]);
    sidebarRef.current.collapse();
  };

  const onParamsSelected = () => {
    wizard.current.goTo([<ReviewColumns />, {}]);
  };

  const state = {
    dates: [dateRange, setDates],
    steps: [numSteps, setNumSteps],
    locationsAndProducts: [locationsAndProducts, setLocationsAndProducts],
    wizard: wizard,
    goHome,
    updateSteps: updateSteps,
    updateDates: updateDates,
    appDates: appDates,
    historySize: [historySize, setHistorySize],
    loaderView,
    onParamsSelected,
    onHomeContinue,
    onColumnsReviewContinue,
    onLocationsSelected,
    onConfigProductsComplete,
    seriesWithConfig: [seriesWithConfig, setSeriesWithConfig],
    modalParent
  };

  return (
    <div className="relative h-full">
      <WizardStateProvider state={state}>
        <ModalParent ref={modalParent}>
          <LoaderView ref={loaderView}>
            <PageView
              ref={wizard}
              currentPage={[
                <Home nextScreen={SelectLocations} />,
                { parentScreen: Home }
              ]}
            />
          </LoaderView>
        </ModalParent>
      </WizardStateProvider>
    </div>
  );
};
