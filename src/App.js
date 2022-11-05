import "./App.css";
import { useRef, useState } from "react";
import preData from "./data.json";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {
  const searchRef = useRef();
  const newRowRef = useRef();
  const [shouldPreloadData, setShouldPreloadData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [indexColorMap, setIndexColorMap] = useState({});

  const colorSetter = (arr, mapKey) => {
    setIndexColorMap((oldObj) => {
      const cloneOld = JSON.parse(JSON.stringify(oldObj));
      const randColor = getRandomColor();

      arr.forEach((elm) => {
        cloneOld[elm] = randColor;
      });

      cloneOld[mapKey] = randColor;

      return cloneOld;
    });
  };

  const searchHandler = () => {
    const searchMap = {};
    const search = searchRef.current.value.split("");
    if (!search.length) {
      setIndexColorMap({});
    }
    const firstChar = search[0];

    tableData.forEach((item, rowInd) => {
      item.forEach((innerItem, colInd) => {
        if (innerItem == firstChar) {
          searchMap[rowInd + "-" + colInd] = {
            straight: [],
            left: [],
            middle: [],
            right: [],
          };

          if (search.length == 1) {
            setIndexColorMap({
              [rowInd + "-" + colInd]: "yellow",
            });
          }
        }

        if (search.length > 1) {
          Object.keys(searchMap).forEach((mapKey) => {
            if (
              Number(mapKey[0]) == rowInd &&
              colInd ==
                Number(mapKey[2]) + searchMap[mapKey].straight.length + 1
            ) {
              if (search[searchMap[mapKey].straight.length + 1] == innerItem) {
                if (searchMap[mapKey].straight.length < search.length) {
                  searchMap[mapKey].straight = [
                    ...searchMap[mapKey].straight,
                    rowInd + "-" + colInd,
                  ];
                }
                if (searchMap[mapKey].straight.length === search.length - 1) {
                  colorSetter(searchMap[mapKey].straight, mapKey);
                }
              }
            }

            if (
              rowInd > Number(mapKey[0]) &&
              colInd < Number(mapKey[2]) &&
              colInd == Number(mapKey[2]) - searchMap[mapKey].left.length + 1
            ) {
              if (search[searchMap[mapKey].left.length + 1] == innerItem) {
                if (searchMap[mapKey].right.length < search.length) {
                  searchMap[mapKey].left = [
                    ...searchMap[mapKey].left,
                    rowInd + "-" + colInd,
                  ];
                }
                if (searchMap[mapKey].left.length === search.length - 1) {
                  colorSetter(searchMap[mapKey].left, mapKey);
                }
              }
            }

            if (
              rowInd > Number(mapKey[0]) &&
              colInd > Number(mapKey[2]) &&
              colInd == Number(mapKey[2]) + searchMap[mapKey].right.length + 1
            ) {
              if (search[searchMap[mapKey].right.length + 1] == innerItem) {
                if (searchMap[mapKey].right.length < search.length) {
                  searchMap[mapKey].right = [
                    ...searchMap[mapKey].right,
                    rowInd + "-" + colInd,
                  ];
                }
                if (searchMap[mapKey].right.length === search.length - 1) {
                  colorSetter(searchMap[mapKey].right, mapKey);
                }
              }
            }

            if (
              rowInd > Number(mapKey[0]) &&
              colInd == Number(mapKey[2]) &&
              rowInd == searchMap[mapKey].middle.length + 1
            ) {
              if (search[searchMap[mapKey].middle.length + 1] == innerItem) {
                if (searchMap[mapKey].middle.length < search.length) {
                  searchMap[mapKey].middle = [
                    ...searchMap[mapKey].middle,
                    rowInd + "-" + colInd,
                  ];
                }

                if (searchMap[mapKey].middle.length === search.length - 1) {
                  colorSetter(searchMap[mapKey].middle, mapKey);
                }
              }
            }
          });
        }
      });
    });
  };

  return (
    <div className="App">
      <input placeholder="search" ref={searchRef} />
      <button
        onClick={() => {
          searchHandler();
        }}
      >
        Search
      </button>
      <br />
      <button
        onClick={() => {
          setShouldPreloadData((old) => !old);
          setTableData(!shouldPreloadData ? preData : []);
        }}
      >
        {shouldPreloadData ? "Clear" : "Load"} Default Data
      </button>

      <br />
      <br />
      <div>
        <table style={{ border: "1px solid black" }}>
          {tableData.map((item, rowInd) => {
            return (
              <tr>
                {item.map((inItem, colInd) => (
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "10px",
                      backgroundColor:
                        indexColorMap[rowInd + "-" + colInd] || "white",
                    }}
                  >
                    {inItem}
                  </td>
                ))}
              </tr>
            );
          })}
        </table>
      </div>
      <br />
      <br />
      <input placeholder="Enter new row" ref={newRowRef} />
      <button
        onClick={() => {
          setTableData((oldData) => {
            const oldDataClone = JSON.parse(JSON.stringify(oldData));
            oldDataClone.push(newRowRef.current.value.split(""));
            console.log("oldDataClone", oldDataClone);
            return oldDataClone;
          });
        }}
      >
        Insert Row
      </button>
    </div>
  );
}

export default App;
