import jester

import httpclient, strutils
import ./lens_db
import ./handlers/query
import ./handlers/series_config
import ./handlers/settings as settingsHandler

let sqliteFilePath = "./site_item_mapping.sqlite"
let db = openDBFromFile(sqliteFilePath)

from posix import SIGINT, SIGTERM, onSignal
onSignal(SIGINT, SIGTERM):
  echo "\nlens-ux closing from signal ", sig
  db.closeConnection()

proc forwardRequest(url: string, body: string): string =
  let client = newHttpClient()
  client.headers = newHttpHeaders({"Content-Type": "application/json"})
  let address = "http://20.73.40.110:5002"

  echo "Forwarding request with body: " & $body & " to address " & address & $url
  let response = client.request(address & $url,
      httpMethod = HttpPost,
      body = body
  )
  echo "Got back: " & response.body
  result = response.body

proc msgjson(msg: string): string =
  """{"msg": $#}""" % [msg]

const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  }

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "Content-Type"
  }

settings:
  port = Port(5000)

routes:
  options "/query":
    resp Http200, corsHeaders, ""
  options "/settings":
    resp Http200, corsHeaders, ""
  post "/settings":
    let (error, content) = handleSettings(db, request)
    if error == "":
      resp Http200, defaultHeaders, content
    else:
      resp Http400, defaultHeaders, msgjson(error)
  post "/configs-set":
    let (error, content) = onConfigsSet(db, request)
    if error == "":
      resp Http200, defaultHeaders, content
    else:
      resp Http400, defaultHeaders, msgjson(error)
  get "/configs-list":
    let (error, content) = onConfigsList(db)
    if error == "":
      resp Http200, defaultHeaders, content
    else:
      resp Http400, defaultHeaders, msgjson(error)
  post "/query":
    let (error, content) = handleQuery(db, request)
    if error == "":
      resp Http200, defaultHeaders, content
    else:
      resp Http400, defaultHeaders, msgjson(error)
  options "/analyze":
    resp Http200, corsHeaders, ""
  post "/analyze":
    echo "/analyze"
    let body = forwardRequest("/analyze", request.body)
    resp Http200, defaultHeaders, body
