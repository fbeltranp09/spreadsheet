import { useEffect, useState } from "react";
import Cell from "./Cell";

function Table({ x, y }) {
  const letters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const heads = [];
  const [cells, setCells] = useState([])

  useEffect(() => {
    initCells();
  }, [x, y])

  const initCells = () => {
    const columns = [];
    for (let i = 0; i <= x; i++) {
      const rows = [];
      for (let j = 0; j <= y; j++) {
        rows.push({ x: j, y: i, info: { value: '', method: '', references: [] } });
      }
      columns.push(rows);
    }
    setCells(columns)
  }

  return (
    <table>
      <thead>
        <tr>{heads}</tr>
      </thead>
      <tbody>
        {cells.map(column =>
          <tr>{column.map(({ x, y, info }) => {
            if (y === 0) {
              return <th className="bg-slate-200 border-2 border-slate-300">{letters[x]}</th>;
            } else if (x === 0) {
              return <th className="bg-slate-200 border-2 border-slate-300">{y}</th>;
            } else {
              return <Cell x={x} y={y} cells={cells} setCells={setCells} />
            }
          })}</tr>)
        }
      </tbody>
    </table>
  );
}

export default Table;