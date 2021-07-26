import json, strformat, db_sqlite, sequtils, strutils, algorithm
import ../lens_db
import ./query_types

proc getSeriesForLocationAndProduct*(db: Database, location: string,
    product: string): seq[string] =
  result = newSeq[string]()
  let queryString = fmt"SELECT id_series FROM site_item_mapping WHERE site={location} and item={product}"
  echo "getSeriesForLocationsAndProduct - queryString is: " & queryString
  for x in db.connection.fastRows(sql(queryString)):
    result.add(x[0])
  result.sort()

proc getSeriesForProductsAndLocations(db: Database,
    products: seq[int], locations: seq[int]): JsonNode =
  result = newJArray()
  let productsQueryString = queryStringFromArray(products)

  let locationsQueryString = queryStringFromArray(locations)
  var queryString: string
  if locations.len == 1 and locations[0] == -1 and products.len == 1 and
      products[0] == -1:
    queryString = fmt"SELECT * FROM site_item_mapping WHERE id_series<=500"
  else:
    if locations.len == 1 and locations[0] == -1:
      queryString = fmt"SELECT * FROM site_item_mapping WHERE item in {productsQueryString} and id_series<=500"
    else:
      if products.len == 1 and products[0] == -1:
        queryString = fmt"SELECT * FROM site_item_mapping WHERE site in {locationsQueryString} and id_series<=500"
      else:
        queryString = fmt"SELECT * FROM site_item_mapping WHERE site in {locationsQueryString} and item in {productsQueryString} and id_series<=500"
  echo "getSeriesForProductsAndLocations - query is: ", queryString
  for x in db.connection.fastRows(sql(queryString)):
    result.add( %* {"location": x[0], "product": x[1],
        "series": x[2]})

proc onGetSeriesForProductsAndLocations*(db: Database, body: JsonNode): (string, string) =
  let locations = body["locations"].elems.map(proc(
      x: JsonNode): int = parseInt($x))
  let products = body["products"].elems.map(proc(
      x: JsonNode): int = parseInt($x))
  echo fmt"get series for products {products} and locations {locations} "
  var series = db.getSeriesForProductsAndLocations(products, locations)
  echo fmt"got series for products {products} and locations {locations} -> {series}"
  return ("", $(%*series))

proc getSeriesForLocationAndProducts*(db: Database, location: int,
    products: seq[int]): SeriesProductLocationArray =
  result = newSeq[SeriesProductLocation]()
  let productsQueryString = queryStringFromArray(products)
  var queryString: string
  if products.len == 1 and products[0] == -1 and location == -1:
          queryString = fmt"SELECT * FROM site_item_mapping WHERE id_series<500"
  elif products.len == 1 and products[0] == -1:
      queryString = fmt"SELECT * FROM site_item_mapping WHERE site = {location} AND id_series<500"
  else:
    if location == -1:
      queryString = fmt"SELECT * FROM site_item_mapping WHERE item in {productsQueryString} and id_series<500"
    else:
      queryString = fmt"SELECT * FROM site_item_mapping WHERE site = {location} AND item in {productsQueryString} and id_series<500"
  echo "getSeriesForLocationAndProducts - query is: ", queryString
  for x in db.connection.fastRows(sql(queryString)):
    result.add(SeriesProductLocation(series: x[2].parseInt(), product: x[
        1].parseInt(), location: x[0].parseInt()))
    # result.add( %* {"location": x[0], "product": x[1], "series": x[2]})

proc onGetSeriesForLocationsAndProducts*(db: Database, body: JsonNode,
    groupBy: string): (string, string) =
  var items = to(body, LocationAndProductsArray)
  echo "onGetSeriesForLocationsAndProducts - groupBy: " & groupBy
  echo "Location and products array is: ", items
  var allSeries = newSeq[SeriesProductLocation]();
  for item in items:
    var currentSeries = db.getSeriesForLocationAndProducts(
        location = item.location, products = item.products);
    for series in currentSeries:
      allSeries.add(series)
    echo fmt"current series for location: {item.location} and products: {item.products}: " & $currentSeries
  allSeries.sort do (x, y: SeriesProductLocation) -> int:
    result = cmp(x.location, y.location)
    if result == 0:
      result = cmp(x.product, y.product)

  echo "json is: " & $(%*(allSeries))
  return ("", $(%*(allSeries)))
  # case groupBy:
  #   of "group-by-none":
  #     return ("", $(%*(allSeries)))
  #   of "group-by-series":
  #     var groupBySeries = newJObject()
  #     for item in allSeries:
  #       let productAndLocation = %*{
  #         "product": item.product,
  #         "location": item.location,
  #       }
  #       groupBySeries.add($item.series, productAndLocation)
  #     echo "groupBySeries is: " & $groupBySeries
  #     return ("", $groupBySeries)
  #   else:
  #     return ("", $(%*(allSeries)))



  # let locations = body["locations"].elems.map(proc(
  #     x: JsonNode): int = parseInt($x))
  # let products = body["products"].elems.map(proc(
  #     x: JsonNode): int = parseInt($x))
  # echo fmt"get series for products {products} and locations {locations} "
  # var series = db.getSeriesForProductsAndLocations(products, locations)
  # echo fmt"got series for products {products} and locations {locations} -> {series}"
  # return ("", $(%*series))
