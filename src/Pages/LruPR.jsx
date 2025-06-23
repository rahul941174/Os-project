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

function LruPR() {
  const [pageRefrences, setPageRefrences] = useState([]);
  const [frames, setFrames] = useState(0);
  const [componentMemoryState, setComponentMemoryState] = useState([]);
  const [pageFaults, setPageFaults] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [tableHeading, setTableHeading] = useState(false);
  const [faultRateData, setFaultRateData] = useState([]); // For fault rate chart

  // handle page reference input
  const handlePageRefrences = (event) => {
    const refString = event.target.value
      .split(" ")
      .map((ref) => parseInt(ref.trim()))
      .filter((ref) => !isNaN(ref));
    setPageRefrences(refString);
  };

  // handle frame input
  const handleFrames = (event) => {
    const numFrames = parseInt(event.target.value);
    setFrames(numFrames);
    setComponentMemoryState(Array(numFrames).fill(null));
  };

  // simulate LRU with fault rate tracking
  const handleSimulate = () => {
    let memory = Array(frames).fill(null);
    let recentUse = [];
    let newTableData = [];
    let faults = 0;
    let faultRateTimeline = [];

    for (let i = 0; i < pageRefrences.length; i++) {
      const page = pageRefrences[i];

      if (!memory.includes(page)) {
        faults++;
        if (memory.includes(null)) {
          const index = memory.indexOf(null);
          memory[index] = page;
        } else {
          const lruPage = recentUse.shift();
          const indexToReplace = memory.indexOf(lruPage);
          memory[indexToReplace] = page;
        }
      } else {
        // Remove current page from recentUse if it exists
        const indexInRecent = recentUse.indexOf(page);
        if (indexInRecent !== -1) {
          recentUse.splice(indexInRecent, 1);
        }
      }

      // Add current page as most recently used
      recentUse.push(page);

      newTableData.push({
        page: page,
        pageFault: faults,
        memory: [...memory],
      });

      // Track fault rate (%) after this reference
      faultRateTimeline.push({
        step: i + 1,
        faultRate: ((faults / (i + 1)) * 100).toFixed(2),
      });
    }

    setPageFaults(faults);
    setComponentMemoryState(memory);
    setTableData(newTableData);
    setTableHeading(true);
    setFaultRateData(faultRateTimeline);
  };

  return (
    <>
      <NavBar />
      <div className="optimal-information-section">
        <main>
          <h1>LRU Page Replacement Algorithm</h1>
          <p>
            LRU (Least Recently Used) page replacement removes the page that
            hasn't been used for the longest time.
          </p>
        </main>

        <div className="optimal-info">
          <h1>Algorithm</h1>
          <p>
            <code>
              <ul>
                <h3>For every reference we do the following:</h3>
                <li>If the page is already in memory, mark it as recently used.</li>
                <li>If not in memory:</li>
                <ul>
                  <li>If there's space, insert the page.</li>
                  <li>
                    If memory is full, remove the least recently used page and
                    insert the new one.
                  </li>
                </ul>
              </ul>
            </code>
          </p>
        </div>
      </div>

      <div className="simulation">
        <div className="Heading">
          <h1>LRU Page Replacement</h1>
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
              onChange={handlePageRefrences}
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
                  {pageRefrences.map((num, index) => (
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
            <h3>Total References: {pageRefrences.length}</h3>
          </div>
          <br />
          <div className="misses">
            <h3>Misses (Page Faults): {pageFaults}</h3>
          </div>
          <br />
          <div className="hits">
            <h3>Hits: {pageRefrences.length - pageFaults}</h3>
          </div>
          <br />
          <div className="hitRate">
            <h3>
              Hit Rate:{" "}
              {(
                ((pageRefrences.length - pageFaults) * 100) /
                pageRefrences.length
              ).toFixed(2)}{" "}
              %
            </h3>
          </div>
          <br />
          <div className="missRate">
            <h3>
              Miss Rate: {(pageFaults * 100) / pageRefrences.length.toFixed(2)} %
            </h3>
          </div>
        </div>

        {/* Dynamic Page Fault Rate Chart */}
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
                    stroke="#ff4d4d"
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

export default LruPR;
