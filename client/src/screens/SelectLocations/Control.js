import React, { useState, useEffect } from "react";
import { echo, SelectValues } from "components";
import { Row, Column } from "components/ui/basic";
import { getProductsForLocations, getLocations } from "data";
import { LocationIcon } from "components/ui/Icons";
import { asyncForEach } from "components/misc";

const getProductsText = values => {
  if (!values) return "No products selected";
  if (values.length === 1 && values[0] === -1) return "All Products";
  else if (values.length == 0) return null;
  else return `${values.length} products selected`;
  // return values.join(".");
};

const getLocationsText = values => {
  if (values.length === 1 && values[0] === -1) return "All Locations";
  else if (values.length === 0) return null;
  else if (values.length === 1) return "1 location selected";
  // + values[0];
  else if (values.length > 1) return values.length + " locations";
  // else return values.join(",");
};

export const SelectLocationsControl = ({ onChange, data }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(
    data.selectedLocations
  );

  const [availableProducts, setAvailableProducts] = useState(
    data.availableProducts
  );
  const [selectedProducts, setSelectedProducts] = useState(
    data.selectedProducts
  );

  const getLocationsFromAPI = async () => {
    // echo("getting locations from API");
    const locationsArray = await getLocations();
    // echo("Got locations: ", locationsArray);
    const productsChildren = locationsArray.map(x => ({
      label: x + "",
      value: x
    }));
    const locations = [
      {
        label: "All locations",
        value: -1,
        children: productsChildren
      }
    ];

    setLocations(locations);
  };

  const updateProductsForSelectedLocations = async () => {
    echo(
      "updateProductsForSelectedLocations - selectedLocations: ",
      selectedLocations
    );
    let newAvailableProducts = null;
    let newSelectedProducts = null;
    await asyncForEach(selectedLocations, async location => {
      // echo("Selected location: ", location);

      if (availableProducts && availableProducts[location]) {
        if (!newAvailableProducts) {
          newAvailableProducts = {};
        }
        newAvailableProducts[location] = availableProducts[location];
      } else {
        // echo("Getting products for location: ", location);
        let productsForLocation = await getProductsForLocations([location]);
        // echo("Got products for location: ", productsForLocation);
        const productsChildren = productsForLocation.map(x => ({
          label: x + "",
          value: x
        }));
        const products = [
          {
            label: "All products",
            value: -1,
            children: productsChildren
          }
        ];
        if (!newAvailableProducts) {
          newAvailableProducts = {};
        }
        newAvailableProducts[location] = products;
      }

      if (selectedProducts && selectedProducts[location]) {
        if (!newSelectedProducts) {
          newSelectedProducts = {};
        }
        newSelectedProducts[location] = selectedProducts[location];
      } else {
        if (!newSelectedProducts) {
          newSelectedProducts = {};
        }
        newSelectedProducts[location] = [-1];
      }
    });
    setAvailableProducts(newAvailableProducts);
    setSelectedProducts(newSelectedProducts);
    if (onChange) {
      onChange({
        selectedLocations: selectedLocations,
        availableProducts: newAvailableProducts,
        selectedProducts: newSelectedProducts
      });
    }
  };

  useEffect(() => {
    updateProductsForSelectedLocations();
    if (locations.length === 0) {
      getLocationsFromAPI();
    }
  }, []); // Empty array - run this effect only once

  useEffect(() => {
    updateProductsForSelectedLocations();
  }, [selectedLocations]);

  useEffect(() => {
    if (onChange) {
      onChange({
        selectedLocations: selectedLocations,
        availableProducts: availableProducts,
        selectedProducts: selectedProducts
      });
    }
  }, [selectedProducts]);

  const [handleLocationsSelected] = useState(() => params => {
    echo("Clicked ok - selected locations", params);
    setSelectedLocations(params.values);
    echo("Selected locations este acum: ", selectedLocations);
  });

  const handleProductsSelected = params => {
    //echo("Products selected: ", params);
    let newSelectedProducts = { ...selectedProducts };
    newSelectedProducts[params.reference] = params.values;
    setSelectedProducts(newSelectedProducts);
  };
  return (
    <div style={{ minWidth: "20rem" }}>
      <div className="p-2">
        <SelectValues
          name="ProductsValueSelector"
          values={locations}
          selectedValues={selectedLocations}
          onOkClick={handleLocationsSelected}
          valuesToText={getLocationsText}
          placeholder="Click to select"
        ></SelectValues>
      </div>
      <Column className="pt-4 ">
        {selectedLocations &&
          selectedLocations.map((value, index, items) => {
            if (!availableProducts) {
              echo("Nu avem availableProducts: ", availableProducts);
              return null;
            }
            if (!selectedProducts) {
              echo("Nu avem selectedProducts: ", selectedProducts);
              return null;
            }
            if (!selectedProducts[value]) {
              echo(
                "Nu avem selectedProducts[value]: ",
                selectedProducts[value]
              );
              return null;
            }
            if (!availableProducts[value]) {
              echo(
                "Nu avem availableProducts[value]: ",
                availableProducts[value]
              );
              return null;
            }
            return (
              <Column
                key={"location-" + value}
                className="p-6 rounded-lg bg-white border border-gray-300 mb-2"
              >
                <Row className="py-2 items-center mb-2" key={value}>
                  <div className="w-4 h-4 mr-2 flex-none text-gray-600">
                    <LocationIcon />
                  </div>
                  <div className="flex-grow">
                    {value === -1 ? "All locations" : "Location " + value}
                  </div>
                </Row>
                <Row className="items-center py-2 font-medium" key={value}>
                  Select Products
                </Row>
                <Row className="py-2">
                  <SelectValues
                    name="ProductsSelector"
                    className="w-full"
                    // alignType="right"
                    reference={value}
                    style={{ minWidth: "9.1rem" }}
                    values={availableProducts[value]}
                    selectedValues={selectedProducts[value]}
                    onOkClick={handleProductsSelected}
                    valuesToText={getProductsText}
                    placeholder="Select products"
                  ></SelectValues>
                </Row>
              </Column>
            );
          })}
      </Column>
    </div>
  );
};
