import React from "react";

const NavBar = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 3100,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="nav-bar">
        <section className="nav-items">
          <nav>
            <ul>
              <li>
                <a href="/"><b>Home</b></a>
              </li>
              <li>
                <a href="#team" onClick={handleClick}><b>Team</b></a>
              </li>

              {/* PAGE REPLACEMENT ALGORITHMS DROPDOWN */}
              <li className="dropdown">
                <a href="#"><b>Page Replacement</b></a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/LfuPR">LFU Page Replacement</a>
                  </li>
                  <li>
                    <a href="/LruPR">LRU Page Replacement</a>
                  </li>
                  <li>
                    <a href="/FifoPR">FIFO Page Replacement</a>
                  </li>
                  <li>
                    <a href="/Optimal">Optimal Page Replacement</a>
                  </li>
                </ul>
              </li>

              {/* PROCESS SCHEDULING ALGORITHMS DROPDOWN */}
              <li className="dropdown">
                <a href="#"><b>Process Scheduling</b></a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="/fcfs">FCFS Scheduling</a>
                  </li>
                  <li>
                    <a href="/sjf">SJF Scheduling</a>
                  </li>
                  <li>
                    <a href="/priority">Priority (Preemptive)</a>
                  </li>
                  <li>
                    <a href="/roundrobin">Round Robin</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </>
  );
};

export default NavBar;
