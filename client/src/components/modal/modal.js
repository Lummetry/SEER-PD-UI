import React from "react";
import ReactDOM from "react-dom";
import { echo } from "components";

const ModalHeader = props => (
  <div className="flex justify-between items-center pb-3">
    <p className="text-xl font-bold select-none">{props.title}</p>
    <div onClick={props.onCancel} className="cursor-pointer z-40">
      <svg
        className="fill-current text-black"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
      >
        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
      </svg>
    </div>
  </div>
);
const Modal = props => {
  echo("Modal props: ", props);
  return ReactDOM.createPortal(
    <div
      onClick={props.onCancel}
      className="modal fixed w-full h-full left-0 right-0 flex items-start justify-center"
    >
      <div className={"absolute w-full h-full " + props.overlayClassName}></div>

      <div
        className={
          "bg-white max-w-full max-h-full rounded shadow-lg z-40 " +
          props.className
        }
      >
        <div onClick={e => e.stopPropagation()} className="py-4 text-left px-6">
          {props.children}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
export { Modal, ModalHeader };
export { UseModal } from "./use-modal";
