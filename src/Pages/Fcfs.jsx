import React, { useState } from "react"; 
import "../Css/Scheduler.css"; 
import NavBar from "../components/NavBar.jsx";

const Fcfs = () => {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState({ id: "", arrival: "", burst: "" });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addProcess = () => {
    if (!input.id || input.arrival === "" || input.burst === "") return;
    setProcesses([...processes, {
      id: input.id,
      arrival: parseInt(input.arrival),
      burst: parseInt(input.burst),
    }]);
    setInput({ id: "", arrival: "", burst: "" });
  };

  const simulate = () => {
    const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
    let time = 0;
    const updated = sorted.map((p) => {
      const start = Math.max(time, p.arrival);
      const finish = start + p.burst;
      const turnaround = finish - p.arrival;
      const waiting = turnaround - p.burst;
      time = finish;
      return { ...p, start, finish, turnaround, waiting };
    });
    setResults(updated);
  };

  return (
    <>
      <NavBar />
      <div className="scheduler-container fcfs-bg">
        <h1>FCFS Scheduling Simulator</h1>
        
        <div className="algo-info">
          <h2>First-Come, First-Served (FCFS) Scheduling</h2>
          <p>
            FCFS is the simplest CPU scheduling algorithm. Processes are executed in the order they arrive.
            It is a non-preemptive algorithm — once a process starts executing, it runs till completion.
            This method may lead to a high average waiting time if shorter processes get stuck behind longer ones.
          </p>
          <ul>
            <li>Each process is scheduled based on its arrival time.</li>
            <li>No preemption — a running process cannot be interrupted.</li>
            <li>Waiting Time = Start Time - Arrival Time</li>
            <li>Turnaround Time = Completion Time - Arrival Time</li>
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

export default Fcfs;
