import React, { useState, useRef, useEffect } from "react";
import { ProductConfigTable } from "./Table";

import { echoFor } from "components";
import { EditConfigModal } from "./EditProductConfig";
import { ModalParent, showModal } from "components/ui/Modal";
import { LoaderView } from "components/ui/LoaderView";

export const ProductConfigControl = ({ rowsData, onEditModalClosed }) => {
  let echo = echoFor("ProductConfigControl");
  echo("render");

  const loaderView = useRef();
  const modalParent = useRef(null);

  useEffect(() => {}, []);

  const onRowClick = async row => {
    echo("Clicked on row: ", row);

    showModal(EditConfigModal, modalParent, {
      params: {
        pentru_input: "o valoare"
      },
      on: {
        submit: result => {
          echo("EditConfigModal submit result: ", result);
        }
      }
    });
  };

  return (
    <ModalParent ref={modalParent}>
      <LoaderView ref={loaderView}>
        <ProductConfigTable rowsData={rowsData} onRowClick={onRowClick} />
      </LoaderView>
    </ModalParent>
  );
};
