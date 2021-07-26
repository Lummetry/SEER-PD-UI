import json, db_sqlite, strformat, sequtils, strutils, algorithm
import ../lens_db

proc getLocationsForProducts(db: Database, products: seq[int]): seq[int] =
  result = newSeq[int]()
  let productsQueryString = queryStringFromArray(products)
  echo "getLocationsForProducts - Products is: ", productsQueryString
  var queryString: string
  if products.len == 1 and products[0] == -1:
    queryString = fmt"SELECT DISTINCT site FROM site_item_mapping WHERE id_series<=500"
  else:
    queryString = fmt"SELECT DISTINCT site FROM site_item_mapping WHERE item in {productsQueryString} and id_series<=500"
  echo "getLocationsForProducts - query is: ", queryString
  for x in db.connection.fastRows(sql(queryString)):
    result.add(x[0].parseInt())
  echo "returned locations for products"
  result.sort()

proc onGetLocationsForProducts*(db: Database, body: JsonNode): (string, string) =
  let products = body["products"].elems.map(proc(x: JsonNode): int = parseInt($x))
  var locations = db.getLocationsForProducts(products)
  echo fmt"get locations for products {products} - {locations}"
  return ("", $(%*locations))

proc getLocations(db: Database): seq[int] =
  result = newSeq[int]()
  let queryString = fmt"SELECT DISTINCT site FROM site_item_mapping"
  try:
    for x in db.connection.fastRows(sql(queryString)):
      result.add(x[0].parseInt())
  except:
    stderr.writeLine(getCurrentExceptionMsg())
  result.sort

proc onGetLocations*(db: Database): string =
  let locations = db.getLocations()
  result = $(%*locations)
  echo "getLocations returned: " & result
