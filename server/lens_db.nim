import strformat, db_sqlite, strutils, sequtils

type
  Database* = object
    connection*: DbConn

proc executeChunk*(args: tuple[db: Database, tableName: string, columns: seq[
    string], rows: seq[seq[string]]]) =
  var statement = fmt"""
    INSERT INTO {args.tableName}({args.columns.join(",")}) 
    VALUES
    """
  var insertableRows: seq[string] = newSeqOfCap[string](args.rows.len)
  for row in args.rows:
    var insertableRow = "(" & row.mapIt("'" & it.replace("?", "").replace("'",
        "") & "'").join(",") & ")"
    insertableRows.add(insertableRow)
  let executableStatement = statement & insertableRows.join(",") & ";"
  discard args.db.connection.tryExec(SqlQuery(executableStatement))

proc closeConnection*(db: Database) =
  db.connection.close()

proc openDBFromMemory*(): Database =
  Database(
    connection: open(":memory:", "", "", "")
  )

proc openDBFromFile*(filePath: string): Database =
  Database(
      connection: open(filePath, "", "", "")
  )

proc queryStringFromArray*(input: seq[int]): string =
  let inputAsString = $input
  result = "(" & inputAsString[2..^2] & ")"







