import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import "./Css/Homepage.css";
import Optimal from "./Pages/Optimal";
import FifoPR from "./Pages/FifoPR";
import LruPR from "./Pages/LruPR";
import LfuPR from "./Pages/LfuPR";
import Fcfs from "./Pages/Fcfs";
import Sjf from "./Pages/Sjff";
import Priority from "./Pages/Priority";
import RoundRobin from "./Pages/RoundRobin";
import FinalHomePage from "./Pages/FinalHomePage";

function App() {
  const commands = [
    {
      command: "reset",
      callback: ({ resetTranscript }) => resetTranscript(),
    },
    {
      command: "Open *",
      callback: (pageName) => {
        const destination =
          pageName.toLowerCase() === "home" ||
            pageName.toLowerCase() === "homepage"
            ? "/"
            : `/${pageName}`;
        window.open(destination, "_self");
      },
    },

    {
      command: "go to *",
      callback: (pageName) => {
        const destination =
          pageName.toLowerCase() === "home" ||
            pageName.toLowerCase() === "homepage"
            ? "/"
            : `/${pageName}`;
        window.open(destination, "_self");
      },
    },
    {
      command: "Reset",
      callback: (e) => {
        window.location.reload();
      },
    },
    {
      command: "Simulate",
      callback: (e) => {
        window.scrollTo({
          top: 1150,
          behavior: "smooth",
        });
      },
    },
    {
      command: "Turn on Dark Mode",
      callback: (e) => {
        document.body.style.backgroundColor = " #0A192F ";
      },
    },
    {
      command: "Turn on light mode",
      callback: (e) => {
        document.body.style.backgroundColor = " #F0F4F8 ";
      },
    },
    {
      command: "Turn on bright mode",
      callback: (e) => {
        document.body.style.backgroundColor = " white ";
      },
    },
    {
      command: "Scroll to top",
      callback: (e) => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    },
    {
      command: "Scroll Down",
      callback: (e) => {
        window.scrollTo({
          top: 2500,
          behavior: "smooth",
        });
      },
    },
    {
      command: "Scroll to optimal",
      callback: (e) => {
        window.scrollTo({
          top: 1000,
          behavior: "1350",
        });
      },
    },
    {
      command: "About Team",
      callback: (e) => {
        const element = document.querySelector("#team");
        const id = element.getAttribute("id");

        window.scrollTo({
          top: document.querySelector(`#${id}`).offsetTop,
          behavior: "smooth",
        });
      },
    },
  ];

  return (

    <div className="App">
      <Routes>
        <Route path="/LfuPR" element={<LfuPR />} />
        <Route path="/LruPR" element={<LruPR />} />
        <Route path="/FifoPR" element={<FifoPR />} />
        <Route path="/Optimal" element={<Optimal />} />
        <Route path="/sjf" element={<Sjf />} />
        <Route path="/fcfs" element={<Fcfs />} />
        <Route path="/priority" element={<Priority />} />
        <Route path="/roundrobin" element={<RoundRobin />} />
        <Route path="/" element={<FinalHomePage />} />
      </Routes>
    </div>
  );
}

export default App;
