import jester, json
import ../lens_db

import ./locations, ./products, ./series, ./series_config

proc handleQuery*(db: Database, r: Request): (string, string) =
  let body = try:
    r.body.parseJson
  except: newJNull()
  if body.isNil:
    return ("Invalid json", "")
  let queryType = body[0].getStr()
  echo "handleQuery: " & queryType
  case queryType:
    of "locations":
      return ("", onGetLocations(db))
    of "locations-for-products":
      return onGetLocationsForProducts(db, body[1])
    of "products":
      return onGetProducts(db)
    of "products-for-locations":
      return onGetProductsForLocations(db, body[1])
    of "series-for-products-and-locations":
      return onGetSeriesForProductsAndLocations(db, body[1])
    of "series-for-locations-and-products":
      return onGetSeriesForLocationsAndProducts(db = db, body = body[1],
          groupBy = body[2].getStr())
    of "config-for-products-and-locations":
      return onGetConfigForProductsAndLocations(db, body[1])
    else:
      return ("Unknown query: " & queryType, "")
