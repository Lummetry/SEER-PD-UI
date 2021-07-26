import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef
} from "react";

import { Modal2 } from "components/ui/Modal/Modal2";
import { echoFor } from "components/echo/echo";
import { ModalDefaultClasses } from "components/ui/Modal";
var cloneDeep = require("lodash.clonedeep");

const ModalContainer = ({ index, renderFunction, config, ...props }) => {
  let echo = echoFor("ModalContainer");
  let RenderFunction = renderFunction;
  const newModalRef = useRef();
  if (!config.ref) {
    echo("Ref not specified - creating a new one");
    config.ref = newModalRef;
  } else {
    echo("Using existing ref");
  }
  return (
    <Modal2
      key={index}
      {...config.props}
      config={config}
      ref={config.ref}
      {...props}
    >
      <RenderFunction {...config.params} modal={config.ref} />
    </Modal2>
  );
};

export const ModalParent = forwardRef(({ children, ...rest }, ref) => {
  // let echo = echoFor("ModalParent");
  let echo = () => {};
  const [modals, setModals] = useState([]);
  const show = (renderFunction, config) => {
    let localModals = [...modals];

    if (!config.ref) {
      echo("We don't have a ref for this modal");
    } else {
      echo("Creating new modal with ref: ", config.ref);
    }
    let newModal = {
      renderFunction: renderFunction,
      config: config
    };
    localModals.push(newModal);
    setModals(localModals);
  };

  useImperativeHandle(ref, () => ({
    show: show
  }));

  const handleClose = (config, closeParams) => {
    echo("handleClose: - config: ", config, " - closeParams: ", closeParams);
    if (config.on && config.on.submit) {
      if (closeParams.type === "submit") {
        config.on.submit(closeParams.params);
      }
    }
  };

  const onCloseCompleted = ({ theRef, ...params }) => {
    echo("closed the modal - params: ", params);
    // let theRef = params.theRef;
    let localModals = [...modals];
    let foundIndex = -1;
    let foundConfig = null;

    for (const [index, value] of localModals.entries()) {
      if (value.config.ref === theRef) {
        foundIndex = index;
        foundConfig = value.config;
        break;
      }
    }
    if (foundIndex !== -1) {
      // echo(
      //   "Found the modal at index: ",
      //   foundIndex,
      //   " with config: ",
      //   foundConfig
      // );

      // echo("Removing the modal from the array");
      localModals.splice(foundIndex, 1);
      setModals(localModals);
    } else {
      echo("Coult not find closed modal index");
    }
    handleClose(foundConfig, params);
  };

  const modalsContent = modals.map((modal, index) => {
    return (
      <ModalContainer
        key={index}
        renderFunction={modal.renderFunction}
        index={index}
        config={modal.config}
        onCloseCompleted={onCloseCompleted}
      />
    );
  });

  return (
    <>
      {children}
      {modalsContent}
    </>
  );
});

export const showModal = (RenderFunction, modalParent, args, windowClass) => {
  let customClasses = cloneDeep(ModalDefaultClasses);
  customClasses.Overlay += " bg-gray-200 opacity-75";
  // customClasses.Window += " w-full h-full";
  customClasses.Window += " " + windowClass;
  customClasses.Contents += " overflow-hidden w-full ";
  modalParent.current.show(RenderFunction, {
    params: args && args.params ? args.params : null,
    props: {
      classes: customClasses
      // parent: "modal-root"
    },
    on: args && args.on ? args.on : null
  });
};
