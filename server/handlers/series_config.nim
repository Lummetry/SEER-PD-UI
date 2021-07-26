import json, strformat, db_sqlite, strutils, jester
import ../lens_db
import ./query_types

proc getConfigForProductsAndLocations(db: Database,
    products: seq[int], locations: seq[int]): JsonNode =
  result = newJArray()
  let productsQueryString = queryStringFromArray(products)

  let locationsQueryString = queryStringFromArray(locations)
  var queryString: string
  if locations.len == 1 and locations[0] == -1 and products.len == 1 and
      products[0] == -1:
    queryString = fmt"SELECT * FROM series_config WHERE item "
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

proc onGetConfigForProductsAndLocations*(db: Database, body: JsonNode): (string, string) =
  var items = to(body, ProductAndLocationsArray)
  echo "Product and locations array is: " & $items
  return ("", "")

proc setConfigItem(db: Database, item: AddConfigItem): (string, string) =
  echo fmt"Adding config item - product: {item.product} location: {item.location} lead_time: {item.lead_time} initial_stock: {item.initial_stock}"
  try:
    db.connection.exec(sql"INSERT OR REPLACE INTO series_config (item,site,lead_time,initial_stock) VALUES (?,?,?,?)",
    item.product, item.location, item.lead_time, item.initial_stock)
  except:
    return ("error", fmt"Could not save config - product: {item.product} location: {item.location} lead_time: {item.lead_time} initial_stock: {item.initial_stock}" &
        getCurrentExceptionMsg())
  return ("", "add-ok")

proc listConfigs*(db: Database): JsonNode =
  result = newJObject()
  var queryString: string
  queryString = fmt"SELECT item,site,lead_time,initial_stock FROM series_config"
  echo "listConfigs - query is: ", queryString
  try:
    for x in db.connection.fastRows(sql(queryString)):

      let location = %*{
          "lead_time": x[2].parseInt(),
          "initial_stock": x[3].parseInt()
      }
      if not result.hasKey(x[0]):
        result.add(x[0], %*{x[1]: location})
      else:
        result[x[0]].add(x[1], location)
  except:
    echo fmt"Could not list configs: " & getCurrentExceptionMsg()
  echo "returned configs: " & $result

proc onConfigsList*(db: Database): (string, string) =
  let jsonConfigs = listConfigs(db);
  return ("", $(jsonConfigs))

proc onConfigsSet*(db: Database, r: Request): (string, string) =
  let body = try:
    r.body.parseJson
  except: newJNull()
  if body.isNil:
    return ("Invalid json", "")
  var itemsToAdd = to(body, AddConfigItemArray)
  for item in itemsToAdd:
    let (error, content) = setConfigItem(db, item)
    if error != "":
      return (error, content)
  return ("", "add-ok")

proc onGetConfigForLocationAndProducts*(db: Database, body: JsonNode): (string, string) =
  var items = to(body, LocationAndProductsArray)
  echo "Product and locations array is: " & $items
  return ("", "")


  # let locations = body["locations"].elems.map(proc(
  #     x: JsonNode): int = parseInt($x))
  # let products = body["products"].elems.map(proc(
  #     x: JsonNode): int = parseInt($x))
  # echo fmt"get series for products {products} and locations {locations} "
  # var series = db.getSeriesForProductsAndLocations(products, locations)
  # echo fmt"got series for products {products} and locations {locations} -> {series}"
  # return ("", $(%*series))
