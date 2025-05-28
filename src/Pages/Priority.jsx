import React, { useState } from "react";
import "../Css/Scheduler.css";
import NavBar from "../components/NavBar.jsx";

const Priority = () => {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState({ id: "", arrival: "", burst: "", priority: "" });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addProcess = () => {
    if (!input.id || input.arrival === "" || input.burst === "" || input.priority === "") return;
    setProcesses([
      ...processes,
      {
        id: input.id,
        arrival: parseInt(input.arrival),
        burst: parseInt(input.burst),
        priority: parseInt(input.priority),
        remaining: parseInt(input.burst),
      },
    ]);
    setInput({ id: "", arrival: "", burst: "", priority: "" });
  };

  const simulate = () => {
    let time = 0;
    let completed = 0;
    const n = processes.length;
    let procList = processes.map(p => ({ ...p }));
    const timeline = [];
    const resultMap = new Map();

    while (completed < n) {
      const available = procList.filter(p => p.arrival <= time && p.remaining > 0);

      if (available.length === 0) {
        time++;
        continue;
      }

      available.sort((a, b) => a.priority - b.priority);
      const current = available[0];

      timeline.push(current.id);
      current.remaining--;
      time++;

      if (!resultMap.has(current.id)) {
        resultMap.set(current.id, { start: time - 1, finish: 0, waiting: 0, turnaround: 0 });
      }

      if (current.remaining === 0) {
        completed++;
        const finishTime = time;
        const arrivalTime = current.arrival;
        const burstTime = current.burst;
        const turnaround = finishTime - arrivalTime;
        const waiting = turnaround - burstTime;

        resultMap.set(current.id, {
          ...resultMap.get(current.id),
          finish: finishTime,
          turnaround,
          waiting,
          arrival: arrivalTime,
          burst: burstTime,
          priority: current.priority,
          id: current.id,
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

    const resultsArr = [...resultMap.values()].sort((a, b) => a.arrival - b.arrival);

    setResults({ gantt, resultsArr });
  };

  return (
    <>
      <NavBar />
      <div
        className="scheduler-container"
        style={{ backgroundImage: "url('/Images/fcfspic.jpg')" }}
      >
        <h1>Preemptive Priority Scheduling Simulator</h1>

        <div className="algo-info">
          <h2>Preemptive Priority Scheduling</h2>
          <p>
            In this algorithm, the CPU is allocated to the process with the highest priority (lowest priority number) among the available processes.
            It is preemptive, meaning if a new process with higher priority arrives, it interrupts the running process.
          </p>
          <ul>
            <li>Processes are scheduled based on priority and arrival time.</li>
            <li>Lower priority number indicates higher priority.</li>
            <li>Preemption occurs if a higher priority process arrives.</li>
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
            name="priority"
            value={input.priority}
            onChange={handleChange}
            placeholder="Priority"
            type="number"
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
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.id}</td>
                    <td>{p.arrival}</td>
                    <td>{p.burst}</td>
                    <td>{p.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={simulate} className="simulate-btn">
          Simulate
        </button>

        {results.resultsArr && results.resultsArr.length > 0 && (
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
                  <th>Priority</th>
                  <th>Start</th>
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
                    <td>{p.priority}</td>
                    <td>{p.start}</td>
                    <td>{p.finish}</td>
                    <td>{p.waiting}</td>
                    <td>{p.turnaround}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default Priority;
