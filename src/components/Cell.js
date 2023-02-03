import { useState } from "react";

function Cell({ x, y, cells, setCells }) {
  let cell = cells[x][y];
  const info = cell.info;
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    cells[x][y] = { ...cell, info: { ...info, method: event.target.value } };
    setCells([...cells]);
  };

  const calculateCell = ({ aX, aY }) => {
    const method = cells[aX][aY].info.method;
    let sum = method;
    if (method.startsWith("=") && method.length > 1) {
      sum = eval(doSum({ aX, aY }, method));
    }
    cells[aX][aY] = {
      ...cells[aX][aY],
      info: { ...cells[aX][aY].info, value: sum, method },
    };
    setCells([...cells]);
    setIsFocused(false);
    refreshAllReferences({ aX, aY });
  };

  const handleBlur = () => {
    calculateCell({ aX: x, aY: y });
  };

  const refreshAllReferences = ({ aX, aY }) => {
    const length = cells[aX][aY].info.references.length;
    for (let i = 0; i < length; i++) {
      calculateCell({
        aX: cells[aX][aY].info.references[i].x,
        aY: cells[aX][aY].info.references[i].y,
      });
    }
  };

  const doSum = ({ aX, aY }, exp) => {
    exp = exp.replace("=", "");

    let indexSum = exp.indexOf("+");
    let indexSub = exp.indexOf("-");
    let firstIndex;
    let op;

    if (
      (0 < indexSum && indexSum < indexSub) ||
      (indexSub < 0 && indexSub < indexSum)
    ) {
      firstIndex = indexSum;
      op = "+";
    } else if (
      (0 < indexSub && indexSub < indexSum) ||
      (indexSum < 0 && indexSum < indexSub)
    ) {
      firstIndex = indexSub;
      op = "-";
    } else {
      return checkCell({ aX, aY }, exp);
    }
    return (
      checkCell({ aX, aY }, exp.slice(0, firstIndex)) +
      `${op}` +
      doSum({ aX, aY }, exp.slice(firstIndex + 1, exp.length))
    );
  };

  const checkCell = ({ aX, aY }, coord) => {
    let toReturn;
    const letters = "-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let index = letters.indexOf(coord.slice(0, 1));
    let auxIndex = index;
    let count = 0;
    // check how many letters
    while (auxIndex > 0) {
      count++;
      auxIndex = letters.indexOf(coord.slice(count, count + 1));
    }
    // index > 0 => cell; else number
    if (index > 0) {
      const numCell = parseInt(coord.slice(count, coord.length));
      const lettCell = 26 * (count - 1) + index;
      toReturn = cells[lettCell][numCell].info.value;
      if (
        !cells[lettCell][numCell].info.references.find((reference) => {
          return aX === reference.x && y === reference.y;
        }) &&
        !(index === aX && aY === numCell)
      ) {
        cells[lettCell][numCell].info.references.push({
          x: aX,
          y: aY,
        });
        setCells(cells);
      }
    } else {
      toReturn = coord;
    }
    return toReturn;
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <td className="tdinput border-2 border-slate-300">
      <input
        id={`${x}${y}`}
        size={"10"}
        type="input"
        value={isFocused ? info.method : info.value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      ></input>
    </td>
  );
}

export default Cell;
