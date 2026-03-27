import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

import '../App.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="header">
        <div id="home">
          <h2> Thibault Vanni</h2>
        </div>
        <div id="about">
          <a href="#About" class="nav-link"> <h3> <code> 01.</code>About</h3> </a>
        </div>
        <div id="projects">
          <h3>  <code> 02.</code>Projects </h3>
        </div>
        <div id="contact"> 
          <h3> <code>03.</code>Contact</h3>
        </div>
        <div id="resume">
          <h3> Resume</h3>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="Home">
        <p class="about-text">
            <code>Hi, my name is </code>
            <h1>Thibault Vanni</h1>
            I'm actually student at Université Catholique de Louvain in Louvain-la-Neuve (Belgium).
        </p>
      </section>

      <section id="About">
        <div class='about-title-container'>
          <code class="code-title">01. </code> <span class="about-title">About me</span>
        </div>
        <p class="about-text">
          Hello! My name is Thibault, and I'm currently a student at Université Catholique de Louvain in Louvain-la-Neuve, Belgium. 
          I've almost completed a bachelor's degree in civil engineering with minors in mechanics and electronics. Currently, 
          I'm pursuing a master's degree in informatics. In addition to my studies, I'm actively involved in various personal projects, primarily using Python, 
          but also experimenting with CSS and JSX.

        </p>
      </section>

      <section id="Project">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat.

            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="./icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat.

            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat.

            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat.

            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

          </p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="./icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with me</h2>
          <p>Join me on my social networks</p>
          <ul>
            <li>
              <a href="https://github.com/moimeme01" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="./icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/thibault-vanni" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="./icons.svg#linkedin-icon"></use>
                </svg>
                Linkedin
              </a>
            </li>
          </ul>
        </div>

        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="./icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>

      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>

      <section className="navigation-buttons">
        <Link to="/projets">
            <button className="btn-projets">Voir mes Projets</button>
        </Link>
        <Link to="/famille">
            <button className="btn-famille">Ma Famille</button>
        </Link>
      </section>  


      <div id="social">
        <svg className="icon" role="presentation" aria-hidden="true">
          <use href="./icons.svg#social-icon"></use>
        </svg>
        <h2>Connect with me</h2>
        <p>Join me on my social networks</p>
        <ul>
          <li>
            <a href="https://github.com/moimeme01" target="_blank">
              <svg
                className="button-icon"
                role="presentation"
                aria-hidden="true"
              >
                <use href="./icons.svg#github-icon"></use>
              </svg>
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/thibault-vanni" target="_blank">
              <svg
                className="button-icon"
                role="presentation"
                aria-hidden="true"
              >
                <use href="./icons.svg#linkedin-icon"></use>
              </svg>
              Linkedin
            </a>
          </li>
        </ul>
      </div>

    </>
  )
}

export default Home;