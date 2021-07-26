import parsecsv, streams, strformat, sequtils, strutils, db_sqlite, os

import ./lens_db

type
  Csv = ref object
    filePath: string
    tableName: string
    columns: seq[string]
    types: seq[string]
    hasHeader: bool
    delimiter: char


template guessType(s: string, t: untyped): bool =
  var result = false
  try:
    discard t(s)
    result = true
  except Exception:
    discard
  result

proc getTypesWithMostProbability(types: seq[seq[string]]): seq[string] =
  var totalTimeIsThere = 0
  var pos = 0
  for idx, row in types:
    var rowRecurrentCount = count(types, row)
    if totalTimeIsThere < rowRecurrentCount:
      pos = idx
      totalTimeIsThere = rowRecurrentCount

  types[pos]

proc figureColumnsTypes(rowsSamples: seq[seq[string]]): seq[string] =
  var types: seq[seq[string]] = @[]
  for row in rowsSamples:
    var rowTypes: seq[string] = @[]
    for item in row:
      if guessType(item, parseInt):
        rowTypes.add("int")
      elif guessType(item, parseFloat):
        rowTypes.add("float")
      else:
        rowTypes.add("string")
    types.add(rowTypes)

  let csvTypes = getTypesWithMostProbability(types)
  return csvTypes

proc parseCsv*(csv: Csv) =
  const numOfSamplingRows = 10
  var csvStream = newFileStream(csv.filePath, fmRead)
  var parser: CsvParser
  var rowsSampleCount: seq[seq[string]]
  parser.open(csvStream, csv.filePath, csv.delimiter)

  if csv.hasHeader:
    parser.readHeaderRow()
    csv.columns = parser.headers.mapIt(
      it.replace(" ", "_")
      .replace("'", "")
      .replace(".", "")
      .replace("(", "")
      .replace(")", "")
      .replace("%", "")
      .replace("#", "no")
      .toLowerAscii())
  var samplingCounter = 0
  while parser.readRow():
    let row = parser.row
    if numOfSamplingRows > samplingCounter:
      rowsSampleCount.add(row)
      inc samplingCounter
    else:
      break

  if not csv.hasHeader:
    var columns: seq[string] = @[]
    for idx in countup(1, rowsSampleCount[0].len):
      columns.add(fmt"c_{idx}")
    csv.columns = columns

  csv.types = figureColumnsTypes(rowsSampleCount)

proc csvFromFile(path: string, hasHeader: bool = false): Csv {.used.} =
  ## return a new Csv object
  var (_, tableName, _) = splitFile(path)
  echo "Table name is: " & tableName
  Csv(filePath: path, tableName: tableName, hasHeader: hasHeader,
      delimiter: ',')

proc createTableUsingCsvProperties(db: Database, csv: Csv) {.used.} =
  var columnsWithTypes: seq[string] = @[]
  for idx, column in csv.columns:
    columnsWithTypes.add(fmt"{column} {csv.types[idx]}")

  var statement = fmt"""
    CREATE TABLE {csv.tableName} (
      {columnsWithTypes.join(",")}
    );
  """
  db.connection.exec(SqlQuery(statement))

proc clearDatabase(db: Database, csv: Csv) {.used.} =
  var columnsWithTypes: seq[string] = @[]
  for idx, column in csv.columns:
    columnsWithTypes.add(fmt"{column} {csv.types[idx]}")

  var statement = fmt"""
    DROP TABLE {csv.tableName}
  """
  db.connection.exec(SqlQuery(statement))

proc insertCsvRowsIntoTable(db: Database, csv: Csv) {.used.} =
  db.connection.exec(sql"PRAGMA synchronous=OFF")
  db.connection.exec(sql"BEGIN TRANSACTION;")

  const defaultChunkSize = 1
  var rowsChunk: seq[seq[string]] = @[]
  var csvStream = newFileStream(csv.filePath, fmRead)
  var parser: CsvParser
  parser.open(csvStream, csv.filePath, csv.delimiter)
  if csv.hasHeader:
    parser.readHeaderRow()
  while parser.readRow():
    rowsChunk.add(parser.row)
    if rowsChunk.len == defaultChunkSize:
      executeChunk((db: db, tableName: csv.tableName, columns: csv.columns,
          rows: rowsChunk))
      rowsChunk = @[]
  if rowsChunk.len > 0:
    executeChunk((db: db, tableName: csv.tableName, columns: csv.columns,
        rows: rowsChunk))

  db.connection.exec(sql"COMMIT;")

