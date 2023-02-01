import { useState } from "react";

function Cell({ x, y, cells, setCells }) {
  let cell = cells[x][y];
  const info = cell.info;
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    cells[x][y] = { ...cell, info: { ...info, method: event.target.value } };
    setCells([...cells])
    console.log(cells)
  }

  const calculateCell = ({ aX, aY }) => {
    const method = cells[aX][aY].info.method;
    //console.log(method)
    let sum = method;
    if (method.startsWith('=') && method.length > 1) {
      sum = eval(doSum(method));
    }
    cells[aX][aY] = { ...cells[aX][aY], info: { ...info, value: sum, method } };
    setCells([...cells]);
    setIsFocused(false);
    refreshAllReferences({ aX, aY });
  }

  const handleBlur = () => {
    calculateCell({ aX: x, aY: y })
  }

  const refreshAllReferences = ({ aX, aY }) => {
    //console.log(aX, aY, cells[aX][aY].info.references.length)

    for (let i = 0; i < cells[aX][aY].info.references.length; i++) {
      calculateCell({ aX: cells[aX][aY].info.references[i].x, aY: cells[aX][aY].info.references[i].y });
    }
  }

  const doSum = (val) => {
    val = val.replace('=', '')

    let indexSum = val.indexOf('+');
    let indexSub = val.indexOf('-');
    let firstIndex;
    let op;

    if ((0 < indexSum && indexSum < indexSub) || (indexSub < 0 && indexSub < indexSum)) {
      firstIndex = indexSum;
      op = '+';
    } else if ((0 < indexSub && indexSub < indexSum) || (indexSum < 0 && indexSum < indexSub)) {
      firstIndex = indexSub;
      op = '-';
    } else {
      return checkCell(val);
    }
    return checkCell(val.slice(0, firstIndex)) + `${op}` + doSum(val.slice(firstIndex + 1, val.length));
  }

  const checkCell = (coord) => {
    const letters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let index = letters.indexOf(coord.slice(0, 1));
    let toReturn;
    const aux = parseInt(coord.slice(1, coord.length));


    if (index > 0) {
      toReturn = cells[index][aux].info.value;
      if (!(cells[index][aux].info.references.find(reference => x === reference.x && y === reference.y))
        && !(index == x && y == aux)) {
        console.log(index, aux, x, y)
        cells[index][aux].info.references.push({ x, y });
        setCells(cells);
      }
    } else {
      toReturn = coord;
    }
    return toReturn;
  }

  const handleFocus = () => {
    setIsFocused(true);
  }

  return (
    <td className="tdinput border-2 border-slate-300">
      <input id={`${x}${y}`} size={"10"} type="input" value={isFocused ? info.method : info.value} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}></input>
    </td>
  );
}

export default Cell;