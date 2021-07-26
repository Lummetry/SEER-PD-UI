import React, { useRef } from "react";
import { useWizardState } from "components/ui/Wizard/context";
import { Button, ButtonKind } from "components/ui/Button";
import { Column, Row } from "components/ui/basic";
import { HeaderWithButton } from "components/ui/Wizard/HeaderWithButton";
import { ProductConfigTable } from "screens/ProductConfig/Table";
import { echoFor } from "components";
import { EditConfigModal } from "screens/ProductConfig/EditProductConfig";

import { showModal } from "components/ui/Modal";
import { saveConfigs } from "data/SeriesConfig";

export const ConfigProducts = props => {
  let echo = echoFor("ConfigProducts");
  const state = useWizardState();
  let {
    seriesWithConfig: [seriesWithConfig, setSeriesWithConfig],
    wizard,
    modalParent,
    onConfigProductsComplete
  } = state;

  const onRowClick = async tableRow => {
    let { index, original: rowData } = tableRow;
    echo("Clicked on row with index ", index, " - row: ", rowData);
    showModal(EditConfigModal, modalParent, {
      params: rowData,
      on: {
        submit: async result => {
          echo(
            "EditConfigModal submit for index",
            index,
            " - result: ",
            result
          );
          await saveConfigs([
            {
              product: rowData.product,
              location: rowData.location,
              lead_time: result.leadTime,
              initial_stock: result.initialStock
            }
          ]);
          let seriesWithConfigLocal = [...seriesWithConfig];
          seriesWithConfigLocal[index].leadTime = result.leadTime;
          seriesWithConfigLocal[index].initialStock = result.initialStock;
          setSeriesWithConfig(seriesWithConfigLocal);
        }
      }
    });
  };

  return (
    <>
      <HeaderWithButton
        text="Bill of Quantity"
        onClick={wizard.current.goBack}
      />

      <Row className="mt-6 justify-center bg-gray-100">
        <Column className="p-16">
          <Row className="justify-center">
            <p className="font-bold text-3xl p-4 self-center">
              Review Products
            </p>
          </Row>
          <Row className="mt-10 justify-center" style={{ maxHeight: "20rem" }}>
            <ProductConfigTable
              rowsData={seriesWithConfig}
              onRowClick={onRowClick}
            />
          </Row>

          <Row className="justify-center pt-4">
            <Button kind={ButtonKind.White} onClick={onConfigProductsComplete}>
              Continue
            </Button>
          </Row>
        </Column>
      </Row>
    </>
  );
};
