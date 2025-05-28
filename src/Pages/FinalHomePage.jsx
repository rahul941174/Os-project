import React, { useRef, useState, Suspense } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Blob from "../Blob/Blob.js";
import "../Css/FinalHomePage.css";
import NavBar from "../components/NavBar.jsx";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Team from "./Team.jsx";

const FinalHomePage = () => {
  const GLTFModel = ({ modelPath, scale = 10, position = [0, 0, 0] }) => {
    const ref = useRef();
    const gltf = useLoader(GLTFLoader, modelPath);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => (ref.current.rotation.y += 0.003));
    return (
      <primitive
        ref={ref}
        object={gltf.scene}
        scale={hovered ? scale * 0.35 : scale * 0.355}
        position={position}
        onMouseOver={(e) => setHovered(true)}
        onMouseOut={(e) => setHovered(false)}
      />
    );
  };

  const ModelViewer = ({ modelPath, scale = 10, position = [0, 0, 0] }) => {
    return (
      <Suspense>
        <GLTFModel modelPath={modelPath} scale={scale} position={position} />
        <OrbitControls />
      </Suspense>
    );
  };

  const teamRef = useRef(null);
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const algorithms = [
    {
      title: "LRU Page Replacement Algorithm",
      description:
        "Least Recently Used (LRU) replaces the page that has not been used for the longest time. This strategy is based on the assumption that pages used recently will likely be used again soon, improving memory efficiency and minimizing page faults.",
      path: "/LruPr",
    },
    {
      title: "LFU Page Replacement Algorithm",
      description:
        "Least Frequently Used (LFU) replaces the page with the lowest access frequency. It is effective for identifying pages that are rarely used over time, making it suitable for workloads with consistent usage patterns.",
      path: "/LfuPr",
    },
    {
      title: "FIFO Page Replacement Algorithm",
      description:
        "First-In-First-Out (FIFO) replaces the oldest page in memory, treating memory like a queue. While simple and easy to implement, it may lead to poor performance under certain workloads (Belady’s Anomaly).",
      path: "/FifoPR",
    },
    {
      title: "Optimal Page Replacement Algorithm",
      description:
        "The Optimal page replacement algorithm replaces the page that will not be used for the longest period in the future. Though ideal in performance, it is theoretical and not implementable in practice since future knowledge is required.",
      path: "/Optimal",
    },
    {
      title: "FCFS Scheduling Algorithm",
      description:
        "First-Come-First-Serve (FCFS) is the simplest CPU scheduling algorithm. Processes are attended in the order they arrive. It is easy to implement but may lead to long waiting times and the convoy effect.",
      path: "/fcfs",
    },
    {
      title: "SJF Scheduling Algorithm",
      description:
        "Shortest Job First (SJF) selects the process with the smallest execution time. It minimizes average waiting time but requires accurate burst time prediction and may cause starvation for longer processes.",
      path: "/sjf",
    },
    {
      title: "Priority Scheduling (Preemptive)",
      description:
        "In Preemptive Priority Scheduling, the CPU is assigned to the process with the highest priority. A lower-priority process is preempted if a higher-priority process arrives, ensuring critical processes are handled first.",
      path: "/priority",
    },
    {
      title: "Round Robin Scheduling Algorithm",
      description:
        "Round Robin assigns each process a fixed time slice (quantum). It cycles through the processes, offering fair sharing of CPU time. It is effective for time-sharing systems and prevents starvation.",
      path: "/roundrobin",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="full-homepage-container " style={{ backgroundColor: "#000000" }}>
        <div className="particles">
          <div className="final-home-page">
            <div className="canvas-container">
              <Suspense fallback={<Html>Loading...</Html>}>
                <Canvas
                  camera={{ position: [0.0, 0.0, 10.0] }}
                  style={{ width: "100%", height: "100vh" }}
                >
                  <Blob />
                </Canvas>
              </Suspense>
            </div>
            <div className="intro-section">
              <h1>OS Project</h1>
            </div>
          </div>
          <section className="scroll-button">
            <div className="back-to-top-btn" onClick={handleClick}>
              <ArrowDropUpIcon fontSize="large" />
            </div>
          </section>
        </div>

        {algorithms.map((algo, index) => (
          <div className="algorithms-section" key={index}>
            <div className="algo-info1">
              <section className="data-section" style={{ padding: "2rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", margin: "20px" }}>
                <h1 style={{ color: "#ffffff", marginBottom: "1rem" }}>{algo.title}</h1>
                <p style={{ color: "#dcdcdc", fontSize: "1.1rem", lineHeight: "1.6" }}>{algo.description}</p>
              </section>
              <section className="button" style={{ marginTop: "1rem" }}>
                <a href={algo.path}>
                  <button style={{ padding: "10px 20px", fontSize: "1rem", borderRadius: "8px", border: "none", backgroundColor: "#00bcd4", color: "white", cursor: "pointer" }}>
                    Open Simulator
                  </button>
                </a>
              </section>
            </div>
          </div>
        ))}

        <div className="team-section" ref={teamRef}>
          <h1>Our Team</h1>
          <div className="ellipse1"></div>
          <div className="ellipse2"></div>
          <div className="ellipse3"></div>
        </div>
      </div>
      <Team />
    </>
  );
};

export default FinalHomePage;
