import React, { useState, forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ModalDefaultAnimation,
  ModalDefaultClasses,
  ModalDefaultStyles
} from "./defaults";

import useDimensions from "react-use-dimensions";
import { echoFor } from "components/echo/echo";

export const ModalPosition = {
  Top: {
    Left: "items-start justify-start",
    Center: "items-start justify-center",
    Right: "items-start justify-end"
  },
  Middle: {
    Left: "items-center justify-start",
    Center: "items-center justify-center",
    Right: "items-center justify-end"
  },
  Bottom: {
    Left: "items-end justify-start",
    Center: "items-end justify-center",
    Right: "items-end justify-end"
  }
};

export const Modal = forwardRef((props, ref) => {
  let echo = echoFor("Modal");
  let {
    animation: customAnimation,
    classes: customClasses,
    styles: customStyles,
    position: customPosition,
    parent: customParent,
    onOpen: customOnOpen,
    onClose: customOnClose,
    onOverlayClick: customOnOverlayClick,
    children,
    methods: customMethods
  } = props;
  echo("created");
  let parent = customParent || "modal-root";
  let position = customPosition || ModalPosition.Middle.Center;
  let customMethodsObject = customMethods ? customMethods(ref) : {};

  // echo("customMethodsObject is: ", customMethodsObject);

  const onClose = customOnClose;
  let defaultOnOverlayClick = () => {
    // echo("defaultOnOverlayClick - onClose: ", onClose);
    ref.current.cancel({ closedBy: "overlay" });
  };

  let onOverlayClick = customOnOverlayClick || defaultOnOverlayClick;

  const onOpen = customOnOpen;

  let [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    hide: () => {
      echo("hide");
      setIsVisible(false);
    },
    show: () => {
      echo("show");
      setIsVisible(true);
    },
    open: params => {
      echo("open - params: ", params);
      if (onOpen) {
        let result = onOpen(params);
        if (result && result.canOpen === false) {
          echo("Can't open modal");
          return;
        }
      }
      ref.current.show();
    },
    close: params => {
      echo("close - params: ", params, " - onClose: ", onClose);
      if (onClose) {
        let result = onClose(params);
        if (result && result.canClose === false) {
          echo("Can't close modal");
          return;
        }
      }
      ref.current.hide();
    },
    ...customMethodsObject
  }));

  // let animation = merge(defaultAnimation, customAnimation);
  let animation = customAnimation ? customAnimation : ModalDefaultAnimation;
  let classes = customClasses ? customClasses : ModalDefaultClasses;
  let styles = customStyles ? customStyles : ModalDefaultStyles;

  const [modalGlassRef, { x, y, width, height }] = useDimensions();

  // echo(`modalGlass - x: ${x} y: ${y} - width: ${width} height: ${height}`);

  let contents = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={modalGlassRef}
          {...animation.Glass}
          onClick={() => onOverlayClick()}
          className={"modal-glass " + position + " " + classes.Glass}
          style={styles.Glass}
        >
          <div
            className={"modal-overlay " + classes.Overlay}
            style={styles.Overlay}
          />
          <motion.div
            {...animation.Window}
            className={"modal-window " + classes.Window}
            style={{
              ...styles.Window,
              maxHeight: `calc(${height}px - 3rem)`,
              maxWidth: `calc(${width}px - 3rem)`
            }}
          >
            <div
              className={"modal-window-contents " + classes.Contents}
              style={{
                ...styles.Contents,
                maxHeight: `calc(${height}px - 3rem)`,
                maxWidth: `calc(${width}px - 3rem)`
              }}
              onClick={e => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  echo("contents : ", contents);

  // Only render the modal if it is visible or we have a current ref
  // the second part of this condition (modalGlassRef.current) makes sure that the
  // exit animation is also working

  if (isVisible || modalGlassRef.current) {
    echo("showing the modal");
    // if (isVisible) {
    if (customParent) {
      let targetParent = document.getElementById(customParent);
      return ReactDOM.createPortal(contents, targetParent);
    }
    return contents;
  } else return null;
});
