import jester, json, db_sqlite, strformat, sequtils
import ../lens_db
import ./query_types

proc saveSetting*(db: Database, key: string, value: string): (string, string) =
  try:
    db.connection.exec(sql"INSERT OR REPLACE INTO settings (setting, value) VALUES (?,?)",
        key, value)
  except:
    return ("error", fmt"Could not save setting {key} with value {value} :" &
        getCurrentExceptionMsg())
  return ("", "save-ok")


proc onSaveSettings(db: Database, body: JsonNode): (string, string) =
  for key, value in body:
    var valueString: string
    case value.kind:
      of JString: valueString = value.getStr
      else: valueString = $value
    echo "key: " & $key & " - value: " & valueString
    let (error, content) = db.saveSetting($key, valueString)
    if (error != ""):
      return(error, content)
  return ("", "save-ok")


proc getSettings*(db: Database, keys: seq[string]): JsonNode =
  result = newJObject()
  let arrayToString = $keys
  let keysQueryString = "(" & arrayToString[2..^2] & ")"
  echo "getSettings - keys is: ", keysQueryString
  var queryString: string
  queryString = fmt"SELECT setting,value FROM settings WHERE setting in {keysQueryString}"
  echo "getSettings - query is: ", queryString
  for x in db.connection.fastRows(sql(queryString)):
    echo "cheie: " & x[0] & " - valoare: " & x[1]
    result.add(x[0], %(x[1]))
  echo "returned settings: " & $result


proc onGetSettings(db: Database, body: JsonNode): (string, string) =
  let settings = body["settings"].elems.map(proc(
      x: JsonNode): string = x.getStr)
  echo "Parsed settings: " & $settings
  let jsonSettings = db.getSettings(settings)
  return ("", $(jsonSettings))


proc handleSettings*(db: Database, r: Request): (string, string) =
  let body = try:
    r.body.parseJson
  except: newJNull()
  if body.isNil:
    return ("Invalid json", "")
  let actionType = body["action"].getStr()
  let param = body["param"]
  echo "handleSettings - action: " & actionType & " - param: " & $param
  case actionType:
    of "save":
      return onSaveSettings(db, body["param"])
    of "get":
      return onGetSettings(db, body["param"])
