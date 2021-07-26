import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, useTabState, usePanelState } from "components/ui/Tabs";

import { getDates } from "data";
import { echo, echoFor } from "components";
// import { ProductPatterns } from "screens/ProductPatterns";
import { BillOfQuantity, BillOfQuantityWizard } from "screens/BillOfQuantity";
import { AppStateProvider, useAppState } from "./context/App";
import { Sidebar } from "components/ui/Sidebar/Sidebar";
import { DemandPatternAnalysis } from "screens/DemandPatternAnalysis";
import { ModalParent } from "components/ui/Modal";

const Tab = ({ children }) => {
  // const cevaState = useTabState();
  const { isActive, onClick } = useTabState();

  isActive ? echo("Tab is active") : echo("Tab is inactive");
  let classes =
    "outline-none cursor-pointer p-2 " +
    (isActive === true ? "text-green-800" : "");
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

const cn = (...args) => args.filter(Boolean).join(" ");

const tabContentVariants = {
  shown: { y: 0, display: "block", transition: { duration: 0.3 } },
  hidden: {
    y: 30,
    transition: {
      duration: 0.1
    },
    transitionEnd: {
      display: "none"
    }
  }
};
const TabContent = ({ className, children }) => {
  const tabContentRef = useRef();
  const isActive = usePanelState();
  // const style = { display: isActive ? "block" : "none" };

  // return isActive ? (
  //   <div className={"tab-content " + className} style={style}>{children}</div>
  // ) : null;

  let alreadyCreated = tabContentRef && tabContentRef.current !== undefined;
  let shouldRender = isActive === true || alreadyCreated === true;

  // echo(
  //   `Tab content render - isActive: ${isActive} - alreadyCreated: ${alreadyCreated} shouldRender: ${shouldRender} tabContentRef: `,
  //   tabContentRef
  // );

  return shouldRender === true ? (
    <motion.div
      ref={tabContentRef}
      variants={tabContentVariants}
      className={cn(
        "tab-content h-full  w-full max-w-full",
        className && className
      )}
      // style={style}
      animate={isActive ? "shown" : "hidden"}
    >
      {children}
    </motion.div>
  ) : null;
};

export const LensApp = props => {
  let echo = echoFor("LensApp");
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const reducer = (state, action) => {
    switch (action.type) {
      case "changeDates":
        return {
          ...state,
          dates: action.newDates,
          steps: action.newSteps
        };
      case "changeSteps":
        return {
          ...state,
          steps: action.newSteps
        };

      default:
        return state;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      echo("Fetching dates inside effect");
      const dates = await getDates();
      setDates(dates);
      setIsLoading(false);
    };

    fetchData();
    // dispatch({type: ' changeDates', newDates:dates});
  }, []);

  const siderbarRef = useRef();
  const modalParentRef = useRef();

  const initialState = {
    dates: dates,
    steps: 15,
    sidebar: siderbarRef,
    modalParent: modalParentRef
  };

  echo("initialState: ", initialState);

  if (isLoading) {
    return <div className="w-full text-center">Loading...</div>;
  }

  return (
    <>
      <AppStateProvider initialState={initialState} reducer={reducer}>
        <ModalParent ref={modalParentRef}>
          <div className="lens-app flex flex-row h-screen max-h-screen">
            <Tabs state={[activeTab, setActiveTab]}>
              <Sidebar />
              <div className="tab-panels flex-grow h-full max-h-full w-full max-w-full bg-gray-100 overflow-hidden">
                <TabContent>
                  <DemandPatternAnalysis />
                  {/* <ProductPatterns /> */}
                </TabContent>
                <TabContent>
                  {/* <BillOfQuantity /> */}
                  <BillOfQuantityWizard />
                </TabContent>
              </div>
            </Tabs>
          </div>
        </ModalParent>
        {/* <div id="modal-root" /> */}
      </AppStateProvider>
    </>
  );
};
