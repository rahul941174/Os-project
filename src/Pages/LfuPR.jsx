// importing necessary modules and css file
import React, { useState } from "react";
import "../Css/OptPR.css";
import NavBar from "../components/NavBar.jsx";

// Defining the functional Component
function LfuPR() {
    const [pageRefrences, setPageRefrences] = useState([]);
    const [frames, setFrames] = useState(0);
    const [componentMemoryState, setComponentMemoryState] = useState([]);
    const [pageFaults, setPageFaults] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [tableHeading, setTableHeading] = useState(false);

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

    // handle LFU simulation
    const handleSimulate = () => {
        let memory = Array(frames).fill(null);
        let freqMap = {};
        let recentMap = {};
        let newTableData = [];
        let faults = 0;

        for (let i = 0; i < pageRefrences.length; i++) {
            const page = pageRefrences[i];

            freqMap[page] = (freqMap[page] || 0) + 1;
            recentMap[page] = i; // update last used index for tie-breaking

            if (!memory.includes(page)) {
                faults++;
                if (memory.includes(null)) {
                    const index = memory.indexOf(null);
                    memory[index] = page;
                } else {
                    // LFU Replacement
                    const freqList = memory.map((p) => ({
                        page: p,
                        freq: freqMap[p],
                        recent: recentMap[p],
                    }));

                    // Sort by frequency, then by recent usage
                    freqList.sort((a, b) => {
                        if (a.freq !== b.freq) return a.freq - b.freq;
                        return a.recent - b.recent;
                    });

                    const pageToReplace = freqList[0].page;
                    const indexToReplace = memory.indexOf(pageToReplace);
                    memory[indexToReplace] = page;
                }
            }

            newTableData.push({
                page: page,
                pageFault: faults,
                memory: [...memory],
            });
        }

        setPageFaults(faults);
        setComponentMemoryState(memory);
        setTableData(newTableData);
        setTableHeading(true);
    };

    return (
        <>
            <NavBar />
            <div className="optimal-information-section">
                <main>
                    <h1>LFU Page Replacement Algorithm</h1>
                    <p>
                        LFU (Least Frequently Used) algorithm replaces the page with the lowest access frequency. If multiple pages have the same frequency, the least recently used among them is replaced.
                    </p>
                </main>

                <div className="optimal-info">
                    <h1>Algorithm</h1>
                    <p>
                        <code>
                            <ul>
                                <h3>For every reference we do the following:</h3>
                                <li>If the page is already in memory, increment its frequency.</li>
                                <li>If not in memory:</li>
                                <ul>
                                    <li>If space is available, insert the page.</li>
                                    <li>If memory is full, remove the least frequently used page.</li>
                                    <li>If tie, remove the least recently used among those.</li>
                                </ul>
                            </ul>
                        </code>
                    </p>
                </div>
            </div>

            <div className="simulation">
                <div className="Heading">
                    <h1>LFU Page Replacement</h1>
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
                            placeholder="e.g. 2 3 2 1 5 2 4 5 3 2 5 2"
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
                            Miss Rate: {(pageFaults * 100 / pageRefrences.length).toFixed(2)} %
                        </h3>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LfuPR;