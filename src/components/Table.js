import { useEffect, useState } from "react";
import Cell from "./Cell";

function Table({ x, y }) {
  const letters = " ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const parseHeader = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const heads = [];
  const [cells, setCells] = useState([]);

  useEffect(() => {
    initCells();
  }, [x, y]);

  const initCells = () => {
    const columns = [];
    for (let i = 0; i <= x; i++) {
      const rows = [];
      for (let j = 0; j <= y; j++) {
        rows.push({
          x: j,
          y: i,
          info: { value: "", method: "", references: [] },
        });
      }
      columns.push(rows);
    }
    setCells(columns);
  };

  const helpHeader = (x) => {
    const letterAux = (x - 1) % parseHeader.length;
    const letter = letterAux >= 0 ? letterAux : parseHeader.length - 1;
    var str = parseHeader[letter];

    for (let i = 0; i < Math.trunc((x - 1) / parseHeader.length); i++) {
      str += parseHeader[letter];
    }
    return str;
  };

  return (
    <table>
      <thead>
        <tr>{heads}</tr>
      </thead>
      <tbody>
        {cells.map((column, index) => (
          <tr key={index}>
            {column.map(({ x, y, info }) => {
              if (y === 0) {
                return (
                  <th
                    key={x + y}
                    className="bg-slate-200 border-2 border-slate-300"
                  >
                    {x < letters.length
                      ? letters[x % letters.length]
                      : helpHeader(x)}
                  </th>
                );
              } else if (x === 0) {
                return (
                  <th
                    key={x + y}
                    className="bg-slate-200 border-2 border-slate-300"
                  >
                    {y}
                  </th>
                );
              } else {
                return (
                  <Cell
                    key={x + y}
                    x={x}
                    y={y}
                    cells={cells}
                    setCells={setCells}
                  />
                );
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
