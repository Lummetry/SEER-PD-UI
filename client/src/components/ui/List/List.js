import React, { useState } from "react";
import { Column } from "components/ui/basic";
import { motion } from "framer-motion";
import { echoFor } from "components/echo/echo";

const defaultVariants = {
  Item: {
    selected: { backgroundColor: "#EBF8FF" },
    normal: { backgroundColor: "#FFFFFF" }
  },
  Icon: {
    selected: { color: "#2B6CB0" },
    normal: { color: "#CBD5E0" }
  }
};

const defaultStyle = {
  Item: {
    All: "flex flex-row border-r-2 pl-4 cursor-pointer items-center",
    Selected: "border-blue-400"
  },
  Icon: {
    All: "flex-none w-8 h-8 p-1",
    Normal: "text-gray-400",
    Selected: "text-blue-700"
  },
  Caption: {
    All:
      "pl-4 py-4 text-base font-medium truncate h-full w-full items-center select-none ",
    Normal: "text-gray-600",
    Selected: " text-blue-700"
  }
};

export const List = ({
  name,
  items,
  selectedIndex: customSelectedIndex,
  onIconClick,
  style: customStyle,
  variants: customVariants
}) => {
  let echo = echoFor(`List - ${name}`);
  if (typeof customSelectedIndex === "undefined") {
    customSelectedIndex = -1;
  }
  const [selectedIndex, setSelectedIndex] = useState(customSelectedIndex);
  echo(`Selected index: ${selectedIndex}`);
  let variants = customVariants ? customVariants : defaultVariants;
  let style = customStyle ? customStyle : defaultStyle;

  return (
    <Column>
      {items.map((item, index) => {
        let itemStyle = style.Item.All;
        let iconStyle = style.Icon.All;
        let captionStyle = style.Caption.All;
        if (index === selectedIndex && item.isSelectable !== false) {
          itemStyle += " " + style.Item.Selected;
          iconStyle += " " + style.Icon.Selected;
        } else {
          itemStyle += " " + style.Item.Normal;
          iconStyle += " " + style.Icon.Normal;
        }

        return (
          <motion.div
            transition={{ duration: 0.4 }}
            animate={
              index === selectedIndex && item.isSelectable !== false
                ? "selected"
                : "normal"
            }
            variants={variants.Item}
            className={itemStyle}
            key={"sidebarItem" + index}
          >
            <motion.div
              animate={
                index === selectedIndex && item.isSelectable !== false
                  ? "selected"
                  : "normal"
              }
              variants={variants.Icon}
              transition={{ duration: 0.4 }}
              className={iconStyle}
              onClick={() => {
                if (selectedIndex === index) {
                  if (onIconClick) {
                    onIconClick();
                  }
                } else {
                  if (item.onClick) item.onClick();
                  if (item.isSelectable !== false) {
                    setSelectedIndex(index);
                  }
                }
              }}
            >
              {item.icon}
            </motion.div>
            <div
              className={captionStyle}
              onClick={() => {
                if (item.onClick) item.onClick();
                setSelectedIndex(index);
              }}
            >
              {item.caption}
            </div>
          </motion.div>
        );
      })}
    </Column>
  );
};
