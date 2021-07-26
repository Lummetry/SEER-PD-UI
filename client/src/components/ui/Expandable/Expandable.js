import React, {
  useState,
  createContext,
  useContext,
  useImperativeHandle,
  forwardRef,
  RefForwardingComponent,
  SetStateAction,
  Dispatch
} from "react";

import { motion } from "framer-motion";

const expandableVariants = {
  expanded: { width: "17rem" },
  collapsed: { width: "4rem" }
};
const ExpandableState = createContext(null);

export const useExpandableState = () => {
  return useContext(ExpandableState);
};

export const Expandable = forwardRef(
  ({ state: outerState, className: customClassName, children }, ref) => {
    const innerState = useState(true);
    const state = outerState || innerState;

    const [isExpanded, setExpanded] = state;

    const toggle = () => setExpanded(!isExpanded);
    const collapse = () => setExpanded(false);
    const expand = () => setExpanded(true);

    useImperativeHandle(ref, () => ({
      toggle,
      collapse,
      expand
    }));

    let className = customClassName ? customClassName : "";

    return (
      <ExpandableState.Provider value={state}>
        <motion.div
          className={"expandable " + className}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={expandableVariants}
        >
          {children}
        </motion.div>
      </ExpandableState.Provider>
    );
  }
);
