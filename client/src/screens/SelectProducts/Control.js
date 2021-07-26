import React, { useState, useEffect } from "react";
import { echo, SelectValues } from "components";
import { Row, Column } from "components/ui/basic";
import { getProducts, getLocationsForProducts } from "data";
import { ProductIcon } from "components/icons";
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
  else if (values.length === 1) return "Location " + values[0];
  else if (values.length > 1) return values.length + " locations";
  // else return values.join(",");
};

export const SelectProductsControl = ({ onChange, data }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(
    data.selectedProducts
  );

  const [availableLocations, setAvailableLocations] = useState(
    data.availableLocations
  );
  const [selectedLocations, setSelectedLocations] = useState(
    data.selectedLocations
  );

  const getProductsFromAPI = async () => {
    echo("getting products from API");
    const productsArray = await getProducts();
    const productsChildren = productsArray.map(x => ({
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

    setProducts(products);
  };

  const updateLocationsForSelectedProducts = async () => {
    echo(
      "updateLocationsForSelectedProducts - selectedProducts: ",
      selectedProducts
    );
    let newAvailableLocations = null;
    let newSelectedLocations = null;
    await asyncForEach(selectedProducts, async product => {
      echo("Selected product: ", product);

      if (availableLocations && availableLocations[product]) {
        if (!newAvailableLocations) {
          newAvailableLocations = {};
        }
        newAvailableLocations[product] = availableLocations[product];
      } else {
        echo("Getting locations for product: ", product);
        let locationsForProduct = await getLocationsForProducts([product]);
        echo("Got locations for product: ", locationsForProduct);
        const locationsChildren = locationsForProduct.map(x => ({
          label: x + "",
          value: x
        }));
        const locations = [
          {
            label: "All locations",
            value: -1,
            children: locationsChildren
          }
        ];
        if (!newAvailableLocations) {
          newAvailableLocations = {};
        }
        newAvailableLocations[product] = locations;
      }

      if (selectedLocations && selectedLocations[product]) {
        if (!newSelectedLocations) {
          newSelectedLocations = {};
        }
        newSelectedLocations[product] = selectedLocations[product];
      } else {
        if (!newSelectedLocations) {
          newSelectedLocations = {};
        }
        newSelectedLocations[product] = [-1];
      }
    });
    setAvailableLocations(newAvailableLocations);
    setSelectedLocations(newSelectedLocations);
    if (onChange) {
      onChange({
        selectedProducts: selectedProducts,
        availableLocations: newAvailableLocations,
        selectedLocations: newSelectedLocations
      });
    }
  };

  useEffect(() => {
    updateLocationsForSelectedProducts();
    if (products.length === 0) {
      getProductsFromAPI();
    }
  }, []); // Empty array - run this effect only once

  useEffect(() => {
    updateLocationsForSelectedProducts();
  }, [selectedProducts]);

  useEffect(() => {
    if (onChange) {
      onChange({
        selectedProducts: selectedProducts,
        availableLocations: availableLocations,
        selectedLocations: selectedLocations
      });
    }
  }, [selectedLocations]);

  const [handleProductsSelected] = useState(() => params => {
    echo("Clicked ok - selected products", params);
    setSelectedProducts(params.values);
    echo("Selected products este acum: ", selectedProducts);
  });

  const handleLocationsSelected = params => {
    //echo("Locations selected: ", params);
    let newSelectedLocations = { ...selectedLocations };
    newSelectedLocations[params.reference] = params.values;
    setSelectedLocations(newSelectedLocations);
  };

  return (
    <div style={{ minWidth: "20rem" }}>
      <div className="p-2">
        <SelectValues
          name="ProductsValueSelector"
          values={products}
          selectedValues={selectedProducts}
          onOkClick={handleProductsSelected}
          valuesToText={getProductsText}
          placeholder="Click to select"
        ></SelectValues>
      </div>
      <Column className="pt-4">
        {selectedProducts &&
          selectedProducts.map((value, index, items) => {
            if (!availableLocations) {
              echo("Nu avem availableLocations: ", availableLocations);
              return null;
            }
            if (!selectedLocations) {
              echo("Nu avem selectedLocations: ", selectedLocations);
              return null;
            }
            if (!selectedLocations[value]) {
              echo(
                "Nu avem selectedLocations[value]: ",
                selectedLocations[value]
              );
              return null;
            }
            if (!availableLocations[value]) {
              echo(
                "Nu avem availableLocations[value]: ",
                availableLocations[value]
              );
              return null;
            }
            return (
              <Column
                key={"product-" + value}
                className="p-6 rounded-lg bg-white border border-gray-300 mb-2"
              >
                <Row className="items-center mb-2">
                  <div className="w-4 h-4 mr-2 flex-none text-gray-600">
                    <ProductIcon />
                  </div>
                  <div className="flex-grow">
                    {value === -1 ? "All products" : "Product " + value}
                  </div>
                </Row>
                <Row className="items-center py-2 font-medium" key={value}>
                  Select Locations
                </Row>
                <Row className="py-2">
                  <SelectValues
                    name="LocationsSelector"
                    className="w-full"
                    // alignType="right"
                    reference={value}
                    style={{ minWidth: "9.1rem" }}
                    values={availableLocations[value]}
                    selectedValues={selectedLocations[value]}
                    onOkClick={handleLocationsSelected}
                    valuesToText={getLocationsText}
                    placeholder="Select locations"
                  ></SelectValues>
                </Row>
              </Column>
            );
          })}
      </Column>
    </div>
  );
};
