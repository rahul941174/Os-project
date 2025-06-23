import React, { useState } from "react";
import "../Css/Scheduler.css";
import NavBar from "../components/NavBar.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RoundRobin = () => {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState({ gantt: [], resultsArr: [] });
  const [input, setInput] = useState({ id: "", arrival: "", burst: "" });
  const [quantum, setQuantum] = useState(2);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addProcess = () => {
    if (!input.id || input.arrival === "" || input.burst === "") return;
    setProcesses([
      ...processes,
      {
        id: input.id,
        arrival: parseInt(input.arrival),
        burst: parseInt(input.burst),
        remaining: parseInt(input.burst),
      },
    ]);
    setInput({ id: "", arrival: "", burst: "" });
  };

  const simulate = () => {
    let time = 0;
    let queue = [];
    let completed = 0;
    const n = processes.length;
    const procList = processes.map(p => ({ ...p }));
    const timeline = [];
    const resultMap = new Map();

    procList.sort((a, b) => a.arrival - b.arrival);
    let i = 0;

    while (completed < n) {
      while (i < n && procList[i].arrival <= time) {
        queue.push(procList[i]);
        i++;
      }

      if (queue.length === 0) {
        time++;
        continue;
      }

      const current = queue.shift();
      const execTime = Math.min(current.remaining, quantum);

      for (let j = 0; j < execTime; j++) {
        timeline.push(current.id);
      }

      current.remaining -= execTime;
      time += execTime;

      while (i < n && procList[i].arrival <= time) {
        queue.push(procList[i]);
        i++;
      }

      if (current.remaining > 0) {
        queue.push(current);
      } else {
        completed++;
        const finish = time;
        const turnaround = finish - current.arrival;
        const waiting = turnaround - current.burst;

        resultMap.set(current.id, {
          id: current.id,
          arrival: current.arrival,
          burst: current.burst,
          finish,
          turnaround,
          waiting,
        });
      }
    }

    const gantt = [];
    let last = null;
    timeline.forEach((pid) => {
      if (last && last.id === pid) {
        last.duration++;
      } else {
        gantt.push({ id: pid, duration: 1 });
        last = gantt[gantt.length - 1];
      }
    });

    const resultsArr = [...resultMap.values()];
    setResults({ gantt, resultsArr });
  };

  return (
    <>
      <NavBar />
      <div
        className="scheduler-container"
        style={{ backgroundImage: "url('/Images/fcfspic.jpg')" }}
      >
        <h1>Round Robin Scheduling Simulator</h1>

        <div className="algo-info">
          <h2>Round Robin Scheduling</h2>
          <p>
            Round Robin scheduling algorithm assigns a fixed time quantum to each process in a cyclic order. It's fair and preemptive.
          </p>
          <ul>
            <li>Each process gets executed for a defined time slice.</li>
            <li>Preemption occurs if a process doesn't finish within its time quantum.</li>
            <li>Waiting Time = Turnaround Time - Burst Time</li>
            <li>Turnaround Time = Completion Time - Arrival Time</li>
          </ul>
        </div>

        <div className="input-section">
          <input
            name="id"
            value={input.id}
            onChange={handleChange}
            placeholder="Process ID"
          />
          <input
            name="arrival"
            value={input.arrival}
            onChange={handleChange}
            placeholder="Arrival Time"
            type="number"
          />
          <input
            name="burst"
            value={input.burst}
            onChange={handleChange}
            placeholder="Burst Time"
            type="number"
          />
          <input
            value={quantum}
            onChange={(e) => setQuantum(parseInt(e.target.value))}
            placeholder="Time Quantum"
            type="number"
            min={1}
          />
          <button onClick={addProcess}>Add Process</button>
        </div>

        {processes.length > 0 && (
          <div className="process-table">
            <h3>Added Processes</h3>
            <table>
              <thead>
                <tr>
                  <th>Process ID</th>
                  <th>Arrival Time</th>
                  <th>Burst Time</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.id}</td>
                    <td>{p.arrival}</td>
                    <td>{p.burst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={simulate} className="simulate-btn">
          Simulate
        </button>

        {results.resultsArr.length > 0 && (
          <>
            <h2>Execution Timeline (Gantt Chart)</h2>
            <div className="timeline">
              {results.gantt.map((segment, idx) => (
                <div
                  key={idx}
                  className="bar"
                  style={{ width: `${segment.duration * 30}px` }}
                >
                  <span>{segment.id}</span>
                </div>
              ))}
            </div>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Arrival</th>
                  <th>Burst</th>
                  <th>Finish</th>
                  <th>Waiting</th>
                  <th>Turnaround</th>
                </tr>
              </thead>
              <tbody>
                {results.resultsArr.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.id}</td>
                    <td>{p.arrival}</td>
                    <td>{p.burst}</td>
                    <td>{p.finish}</td>
                    <td>{p.waiting}</td>
                    <td>{p.turnaround}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Performance Comparison</h3>
            <div className="chart-container" style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[...results.resultsArr].sort((a, b) => a.id.localeCompare(b.id))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="burst" fill="#ff4d4d" name="Burst Time" />
                  <Bar dataKey="waiting" fill="#8884d8" name="Waiting Time" />
                  <Bar dataKey="turnaround" fill="#82ca9d" name="Turnaround Time" />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ textAlign: "center", marginTop: "8px", fontStyle: "italic" }}>
                Sorted by Process ID
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RoundRobin;
