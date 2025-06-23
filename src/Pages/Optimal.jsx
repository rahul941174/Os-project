// Importing necessary modules and CSS
import React, { useState } from "react";
import "../Css/OptPR.css";
import NavBar from "../components/NavBar.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function OptPR() {
  const [pageReferences, setPageReferences] = useState([]);
  const [frames, setFrames] = useState(0);
  const [pageFaults, setPageFaults] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableHeading, setTableHeading] = useState(false);
  const [faultRateData, setFaultRateData] = useState([]);

  const handlePageReferences = (event) => {
    const refString = event.target.value
      .split(" ")
      .map((ref) => parseInt(ref.trim()))
      .filter((ref) => !isNaN(ref));
    setPageReferences(refString);
  };

  const handleFrames = (event) => {
    const numFrames = parseInt(event.target.value);
    setFrames(numFrames);
  };

  const handleSimulate = () => {
    let newTableData = [];
    let memory = Array(frames).fill(null);
    let faults = 0;
    let faultRateTimeline = [];

    for (let i = 0; i < pageReferences.length; i++) {
      const page = pageReferences[i];

      if (!memory.includes(page)) {
        faults++;
        if (memory.includes(null)) {
          const index = memory.indexOf(null);
          memory[index] = page;
        } else {
          let distances = memory.map((framePage) => {
            const remaining = pageReferences.slice(i + 1);
            const nextIndex = remaining.indexOf(framePage);
            return nextIndex === -1 ? Infinity : nextIndex;
          });
          const replaceIndex = distances.indexOf(Math.max(...distances));
          memory[replaceIndex] = page;
        }
      }

      newTableData.push({
        page,
        pageFault: faults,
        memory: [...memory],
      });

      faultRateTimeline.push({
        step: i + 1,
        faultRate: ((faults / (i + 1)) * 100).toFixed(2),
      });
    }

    setPageFaults(faults);
    setTableData(newTableData);
    setTableHeading(true);
    setFaultRateData(faultRateTimeline);
  };

  return (
    <>
      <NavBar />
      <div className="optimal-information-section">
        <main>
          <h1>Optimal Page Replacement Algorithm</h1>
          <p>
            Optimal page replacement replaces the page whose next use is farthest in the future (or not used again).
          </p>
        </main>

        <div className="optimal-info">
          <h1>Algorithm</h1>
          <p>
            <code>
              <ul>
                <h3>For every reference:</h3>
                <li>If page is in memory, do nothing (hit).</li>
                <li>If page not in memory:</li>
                <ul>
                  <li>If space exists, insert it.</li>
                  <li>If full, replace the one used farthest in the future.</li>
                </ul>
              </ul>
            </code>
          </p>
        </div>
      </div>

      <div className="simulation">
        <div className="Heading">
          <h1>Optimal Page Replacement</h1>
        </div>
        <div className="Frames">
          <label>
            Number of Frames:
            <input
              type="number"
              value={frames}
              onChange={handleFrames}
              min="1"
            />
          </label>
        </div>
        <div className="PageRefrences">
          <label>
            Reference String:
            <input
              type="text"
              onChange={handlePageReferences}
              placeholder="e.g. 7 0 1 2 0 3 0 4"
            />
          </label>
        </div>
        <div className="btn">
          <button onClick={handleSimulate}>Simulate</button>
        </div>

        <div className="table">
          {tableHeading && (
            <table className="table" id="myTable">
              <thead>
                <tr>
                  <th>Page</th>
                  {pageReferences.map((num, index) => (
                    <th key={index}>{num}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData[0].memory.map((frame, index) => (
                  <tr key={index}>
                    <td>Frame {index}</td>
                    {tableData.map((row, rowIndex) => (
                      <td
                        key={rowIndex}
                        className={
                          row.pageFault > tableData[rowIndex - 1]?.pageFault
                            ? "red"
                            : "green"
                        }
                        style={
                          rowIndex === 0 && row.pageFault === 1
                            ? { backgroundColor: "rgb(183, 70, 70)" }
                            : {}
                        }
                      >
                        {row.memory[index]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <br />
          <div className="totalRef">
            <h3>Total References: {pageReferences.length}</h3>
          </div>
          <br />
          <div className="misses">
            <h3>Misses (Page Faults): {pageFaults}</h3>
          </div>
          <br />
          <div className="hits">
            <h3>Hits: {pageReferences.length - pageFaults}</h3>
          </div>
          <br />
          <div className="hitRate">
            <h3>
              Hit Rate:{" "}
              {(
                ((pageReferences.length - pageFaults) * 100) /
                pageReferences.length
              ).toFixed(2)}{" "}
              %
            </h3>
          </div>
          <br />
          <div className="missRate">
            <h3>
              Miss Rate: {(pageFaults * 100 / pageReferences.length).toFixed(2)} %
            </h3>
          </div>
        </div>

        {/* Fault Rate Graph */}
        {faultRateData.length > 0 && (
          <>
            <h2>Page Fault Rate Over Time (%)</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={faultRateData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="step"
                    label={{
                      value: "Reference Step",
                      position: "insideBottom",
                      offset: -5,
                    }}
                    allowDecimals={false}
                  />
                  <YAxis
                    label={{
                      value: "Fault Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="faultRate"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default OptPR;
