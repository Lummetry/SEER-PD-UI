import json, db_sqlite, sequtils, strutils, strformat, algorithm
import ../lens_db

proc getProducts(db: Database): seq[int] =
  result = newSeq[int]()
  let queryString = fmt"SELECT DISTINCT item FROM site_item_mapping WHERE id_series<=500"
  for x in db.connection.fastRows(sql(queryString)):
    result.add(x[0].parseInt())
  result.sort()

proc onGetProducts*(db: Database): (string, string) =
  let products = db.getProducts()
  result = ("", $(%*products))
  # echo "getProducts returned: " & result

proc getProductsForLocations(db: Database, locations: seq[int]): seq[int] =
  result = newSeq[int]()
  let locationsQueryString = queryStringFromArray(locations)
  echo "getProductsForlocations - Locations is: ", locationsQueryString
  var queryString: string
  if locations.len == 1 and locations[0] == -1:
    queryString = fmt"SELECT DISTINCT item FROM site_item_mapping WHERE id_series<=500"
  else:
    queryString = fmt"SELECT DISTINCT item FROM site_item_mapping WHERE site in {locationsQueryString} and id_series<=500"
  echo "getProductsForlocations - query is: ", queryString
  for x in db.connection.fastRows(sql(queryString)):
    result.add(x[0].parseInt())
  echo "returned products for locations"
  result.sort()

proc onGetProductsForLocations*(db: Database, body: JsonNode): (string, string) =
  let locations = body["locations"].elems.map(proc(x: JsonNode): int = parseInt($x))
  var products = db.getProductsForLocations(locations)
  echo fmt"get products for locations {locations} - {products}"
  return ("", $(%*products))
