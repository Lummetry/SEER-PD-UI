import { echo } from "components";
const getIsSortedDesc = (row, sortId) => {
  echo("getIsSortedDesc - row: ", row);
  echo("getIsSortedDesc - row.cells: ", row.cells);
  const columnParent = row.cells.find(el => el.column.id === sortId);
  const { isSortedDesc } = columnParent.column;
  echo(sortId, " - sortedDesc - ", isSortedDesc);
  return isSortedDesc;
};

export const customSort = (rowA, rowB, sortId) => {
  echo("sort --> ", sortId);
  // echo(rowA);
  // echo(rowB);

  var rowWithCells;
  if (rowA.cells !== undefined) {
    rowWithCells = rowA;
  } else if (rowB.cells !== undefined) {
    rowWithCells = rowB;
  }

  echo("rowWithCells: ", rowWithCells);
  echo("rowWithCells.cells[0].column: ", rowWithCells.cells[0].column);

  if (rowWithCells === undefined) {
    echo("getIsSortedDesc - don't have cells");
    echo(rowA);
    echo(rowB);
    return -1;
  }

  if (rowWithCells.cells[0].column === undefined) {
    echo("getIsSortedDesc - don't have cells");
    echo(rowA);
    echo(rowB);
    return -1;
  }

  rowA.canExpand === true && echo("A can expand");
  rowB.canExpand === true && echo("B can expand");

  if (rowA.canExpand === true && rowB.canExpand === false) {
    let isSortedDesc = getIsSortedDesc(rowWithCells, sortId);
    return isSortedDesc === true ? 1 : -1;
  }
  if (rowB.canExpand === true && rowA.canExpand === false) {
    let isSortedDesc = getIsSortedDesc(rowWithCells, sortId);
    return isSortedDesc === true ? -1 : 1;
  }

  let a = rowA.canExpand === true ? rowB.values[sortId] : rowA.values[sortId];
  let b = rowB.canExpand === true ? rowA.values[sortId] : rowB.values[sortId];

  var result = a === b ? 0 : a > b ? 1 : -1;
  // var result = Number(a)-Number(b)

  echo("Compare: ", a, " with ", b, " result: ", result);

  echo("sort <-- ", sortId);
  return result;
};
