import React, { useRef, useEffect } from "react";
import { useTabsState } from "components/ui/Tabs";
import {
  LensLogo,
  StockIcon,
  DashboardIcon,
  SettingsIconFilled
} from "components/ui/Icons";
import { Expandable } from "components/ui/Expandable/Expandable";
import { List } from "components/ui/List/List";
import { Column, Row } from "components/ui/basic";
import { echoFor } from "components";
import { motion } from "framer-motion";
import { useAppState } from "context/App";

import { ProductConfigModal } from "screens/ProductConfig";
import { EditDefaultValues } from "screens/ProductConfig/EditProductConfig/Modal";
import { showModal } from "components/ui/Modal";

const titleVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 }
};

export const Sidebar = () => {
  let echo = echoFor("Sidebar");
  const [activeTab, setActiveTab] = useTabsState();
  echo(`activeTab: ${activeTab}`);
  // eslint-disable-next-line no-unused-vars
  const [{ sidebar: sidebarRef, modalParent }, dispatch] = useAppState();
  // const expandable = useRef(null);
  const expandable = sidebarRef;

  const toggle = () => {
    expandable && expandable.current && expandable.current.toggle();
  };

  const onSettingsClick = () => {
    echo("Clicked on Settings");
    // showModal(ProductConfigModal, modalParent);
    showModal(EditDefaultValues, modalParent);
  };
  useEffect(() => {
    // onSettingsClick();
  }, []);

  return (
    <Expandable
      ref={expandable}
      className="h-full relative overflow-hidden flex flex-col flex-none"
    >
      <Row
        className="cursor-pointer border-r-2 border-gray-200"
        onClick={toggle}
      >
        <div className="w-16 h-16 flex-none justify-center items-center overflow-hidden">
          <div className="w-full p-3 h-full">
            <LensLogo />
          </div>
        </div>
        <div className="self-center flex-grow">
          <motion.span
            variants={titleVariants}
            className="font-bold text-blue-700 text-lg select-none"
          >
            LENS
          </motion.span>
        </div>
      </Row>
      <List
        name="MainMenu"
        selectedIndex={activeTab}
        onIconClick={toggle}
        items={[
          {
            icon: <DashboardIcon />,
            caption: "Demand Pattern Analysis",
            onClick: () => {
              echo("Clicked on Product Pattern Analysis");
              setActiveTab(0);
            }
          },
          {
            icon: <StockIcon />,
            caption: "Bill of Quantity",
            onClick: () => {
              echo("Clicked on Bill of Quantity");
              setActiveTab(1);
            }
          }
        ]}
      />
      <div
        className="sidebar-space border-r-2 border-gray-200 flex-grow cursor-pointer"
        onClick={toggle}
      ></div>
      <div className="justify-end">
        <List
          name="SettingsButton"
          activeIndex={activeTab}
          onIconClick={toggle}
          items={[
            {
              icon: <SettingsIconFilled />,
              caption: "Settings",
              isSelectable: false,

              onClick: () => onSettingsClick()
            }
          ]}
        />
      </div>
    </Expandable>
  );
};
