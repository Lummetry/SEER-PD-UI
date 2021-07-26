import React, { useState, forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence, useExternalRef } from "framer-motion";
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

export const Modal2 = forwardRef((props, ref) => {
  // let echo = echoFor("Modal2");
  let echo = () => {};

  // echo("ref is: ", ref);
  let {
    animation: customAnimation,
    classes: customClasses,
    styles: customStyles,
    position: customPosition,
    parent: customParent,
    onOpen: customOnOpen,
    onCloseCompleted: customOnCloseCompleted,
    onOverlayClick: customOnOverlayClick,
    children,
    methods: customMethods,
    config
  } = props;
  let position = customPosition || ModalPosition.Middle.Center;
  let customMethodsObject = customMethods ? customMethods(ref) : {};

  // echo("customMethodsObject is: ", customMethodsObject);

  const onCloseCompleted = customOnCloseCompleted;
  let defaultOnOverlayClick = () => {
    // echo("defaultOnOverlayClick - onClose: ", onClose);
    ref.current.close({
      closedBy: "overlay"
    });
  };

  let onOverlayClick = customOnOverlayClick || defaultOnOverlayClick;

  const onOpen = customOnOpen;
  const [closeParams, setCloseParams] = useState(null);
  const [userCallbacks, setUserCallbacks] = useState({
    onClose: null
  });

  const [isVisible, setIsVisible] = useState(true);

  const createHandle = () => {
    // echo("createHandle called");
    let handle = {
      set onClose(value) {
        // echo("onClose setter called with: ", value);
        setUserCallbacks({
          ...userCallbacks,
          onClose: value
        });
      },
      hide: () => {
        // echo("hide");
        setIsVisible(false);
      },
      show: () => {
        // echo("show");
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
        // echo("close - params: ", params);
        if (userCallbacks.onClose) {
          // echo("Calling userCallbacks.onClose");
          let result = userCallbacks.onClose(params);
          if (result && result.canClose === false) {
            echo("Can't close modal");
            return;
          }
        }
        setCloseParams(params);
        ref.current.hide();
      },
      submit: params => {
        // echo("submit - params: ", params);
        ref.current.close({
          type: "submit",
          params: params
        });
      },
      cancel: params => {
        echo("submit - params: ", params);
        ref.current.close({
          type: "cancel",
          params: params
        });
      },
      ...customMethodsObject
    };
    return handle;
  };
  useImperativeHandle(ref, createHandle, [userCallbacks, setUserCallbacks]);

  // let animation = merge(defaultAnimation, customAnimation);
  let animation = customAnimation ? customAnimation : ModalDefaultAnimation;
  let classes = customClasses ? customClasses : ModalDefaultClasses;
  let styles = customStyles ? customStyles : ModalDefaultStyles;

  const [modalGlassRef, { x, y, width, height }] = useDimensions();

  // echo(`modalGlass - x: ${x} y: ${y} - width: ${width} height: ${height}`);

  const onExitComplete = () => {
    // echo(
    //   "onExitComplete - onCloseCompleted: ",
    //   onCloseCompleted,
    //   " - config: ",
    //   config
    // );
    if (onCloseCompleted) {
      onCloseCompleted({ ...closeParams, theRef: ref });
    }
  };
  let contents = (
    <AnimatePresence onExitComplete={onExitComplete}>
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

  // echo("contents : ", contents);
  // echo("isVisible: ", isVisible);

  // // Only render the modal if it is visible or we have a current ref
  // // the second part of this condition (modalGlassRef.current) makes sure that the
  // // exit animation is also working

  // if (isVisible) {
  if (customParent) {
    let targetParent = document.getElementById(customParent);
    return ReactDOM.createPortal(contents, targetParent);
  } else return contents;
  // }
  // // if (isVisible || modalGlassRef.current) {
  // if (isVisible) {
  //   echo("showing the modal");
  //   // if (isVisible) {

  //   return contents;
  // } else return null;
});
