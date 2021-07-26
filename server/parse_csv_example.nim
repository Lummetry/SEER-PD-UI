import os, ./parse_csv, strformat

let csvFilePath = "./site_item_mapping.csv"
let sqliteFilePath = changeFileExt(csvFilePath, "sqlite")
let db = openDBFromFile(sqliteFilePath)
  # var newCsv = csvFromFile(csvFilePath, hasHeader = true)
  # newCsv.parseCsv()
  # # let db = openDBFromMemory()
  # db.clearDatabase(newCsv)
  # db.createTableUsingCsvProperties(newCsv)
  # db.insertCsvRowsIntoTable(newCsv)

  # let queryString = fmt"SELECT * FROM {newCsv.tableName}"

  # for x in db.connection.fastRows(sql(queryString)):
  #   echo x
# let locations = db.getLocations()
# echo "Locations: " & $locations

# let products = db.getProducts()
# echo "Products: " & $products

let location = $3
  # let productsForLocation = db.getProductsForLocation(location)
  # echo fmt"Products for location {location}: " & $productsForLocation

let product = $16121
let series = db.getSeriesForLocationAndProduct(location, product)
echo fmt"Series for location {location} and product {product}: " & $series[0]
db.closeConnection()
