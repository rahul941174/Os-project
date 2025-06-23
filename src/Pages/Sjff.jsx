import React, { useState } from "react";
import "../Css/Scheduler.css";
import NavBar from "../components/NavBar.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Sjf = () => {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState({ id: "", arrival: "", burst: "" });

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
      },
    ]);
    setInput({ id: "", arrival: "", burst: "" });
  };

  const simulate = () => {
    let procList = [...processes].map(p => ({ ...p }));
    procList.sort((a, b) => a.arrival - b.arrival);

    let time = 0;
    let completed = 0;
    const n = procList.length;
    const isCompleted = new Array(n).fill(false);
    const res = [];

    while (completed < n) {
      let idx = -1;
      let minBurst = Infinity;
      for (let i = 0; i < n; i++) {
        if (procList[i].arrival <= time && !isCompleted[i] && procList[i].burst < minBurst) {
          minBurst = procList[i].burst;
          idx = i;
        }
      }

      if (idx === -1) {
        const currentTime = time;
        time = procList.reduce((minArrival, p) =>
          (p.arrival > currentTime && p.arrival < minArrival ? p.arrival : minArrival),
          Infinity
        );
        continue;
      }

      const start = time;
      const finish = start + procList[idx].burst;
      const turnaround = finish - procList[idx].arrival;
      const waiting = turnaround - procList[idx].burst;
      const response = start - procList[idx].arrival;

      res.push({
        ...procList[idx],
        start,
        finish,
        turnaround,
        waiting,
        response,
      });

      time = finish;
      isCompleted[idx] = true;
      completed++;
    }

    setResults(res);
  };

  return (
    <>
      <NavBar />
      <div className="scheduler-container sjf-bg">
        <h1>SJF Scheduling Simulator (Non-preemptive)</h1>

        <div className="algo-info">
          <h2>Shortest Job First (SJF) Scheduling</h2>
          <p>
            SJF selects the process with the smallest burst time from the set of processes that have arrived.
            This is a non-preemptive algorithm — once a process starts running, it completes without interruption.
            SJF tends to minimize average waiting time compared to FCFS.
          </p>
          <ul>
            <li>Processes are selected based on the shortest burst time among arrived processes.</li>
            <li>Non-preemptive: running process cannot be interrupted.</li>
            <li>Waiting Time = Start Time - Arrival Time</li>
            <li>Turnaround Time = Completion Time - Arrival Time</li>
            <li>Response Time = Start Time - Arrival Time</li>
          </ul>
        </div>

        <div className="input-section">
          <input name="id" value={input.id} onChange={handleChange} placeholder="Process ID" />
          <input name="arrival" value={input.arrival} onChange={handleChange} placeholder="Arrival Time" type="number" />
          <input name="burst" value={input.burst} onChange={handleChange} placeholder="Burst Time" type="number" />
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

        <button onClick={simulate} className="simulate-btn">Simulate</button>

        {results.length > 0 && (
          <>
            <h2>Execution Timeline (Gantt Chart)</h2>
            <div className="timeline">
              {results.map((p, idx) => (
                <div key={idx} className="bar" style={{ width: `${p.burst * 30}px` }}>
                  <span>{p.id}</span>
                  <div className="time">
                    <span>{p.start}</span>
                    <span>{p.finish}</span>
                  </div>
                </div>
              ))}
            </div>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Arrival</th>
                  <th>Burst</th>
                  <th>Start</th>
                  <th>Finish</th>
                  <th>Waiting</th>
                  <th>Turnaround</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {results.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.id}</td>
                    <td>{p.arrival}</td>
                    <td>{p.burst}</td>
                    <td>{p.start}</td>
                    <td>{p.finish}</td>
                    <td>{p.waiting}</td>
                    <td>{p.turnaround}</td>
                    <td>{p.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Performance Comparison</h3>
            <div className="chart-container" style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[...results].sort((a, b) => a.burst - b.burst)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                 <Bar dataKey="burst" fill="#ff4d4d" name="Burst Time" />
                  <Bar dataKey="waiting" fill="#8884d8" name="Waiting Time" />
                  <Bar dataKey="turnaround" fill="#82ca9d" name="Turnaround Time" />
                  <Bar dataKey="response" fill="#ffc658" name="Response Time" />
                </BarChart>
              </ResponsiveContainer>
               <p style={{ textAlign: "center", marginTop: "8px", fontStyle: "italic" }}>
                  Sorted by Burst Time
                </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sjf;
