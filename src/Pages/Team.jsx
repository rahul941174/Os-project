import react from "react";
import "../Css/Team.css";

const Team = () => {
  return (
    <>
      <div className="team-section" id="team">
      <section class="articles">
        <article>
          <div class="article-wrapper">
            <figure class="images">
              <img src="Rahul.jpeg" alt="" />
            </figure>
            <div class="article-body">
              <h2>RAHUL</h2>
              <section class="description">220112507</section>
              <section class="description">rahul941174@gmail.com</section>
            </div>
          </div>
        </article>
        <article>
          <div class="article-wrapper">
            <figure>
              <img
                src="ArunSingh.jpeg"
                alt=""
              />
            </figure>
            <div class="article-body">
              <h2>ARUN SINGH</h2>
              <section class="description">220111077</section>
              <section class="description">arunsingh220111077@gmail.com</section>
            </div>
          </div>
        </article>
        <article>
          <div class="article-wrapper">
            <figure>
              <img src="Hemant.jpeg" alt="" />
            </figure>
            <div class="article-body">
              <h2>HEMANT JOSHI</h2>
              <section class="description">220111205</section>
              <section class="description">hemantjoshi90803@gmail.com</section>
            </div>
          </div>
        </article>

        <article>
          <div class="article-wrapper">
            <figure>
              <img
                src="Neha.jpeg"
                alt=""
              />
            </figure>
            <div class="article-body">
              <h2>Neha Joshi</h2>
              <section class="description">220121480</section>
              <section class="description">nehajoshi16117@gmail.com</section>
            </div>
          </div>
        </article>
        
      </section>
      </div>
    </>
  );
};
export default Team;
