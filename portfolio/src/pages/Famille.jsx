import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

import '../App.css'


function Famille(){ 
    return(
        <>
            <section id="center">
                <div className="hero">
                    <img src={heroImg} className="base" width="170" height="179" alt="" />
                    <img src={reactLogo} className="framework" alt="React logo" />
                    <img src={viteLogo} className="vite" alt="Vite logo" />
                </div>
                <div>
                    <h4>Si tu atterris ici c'est que tu fais pasrtie de ma famille. (ou que t'es un bon hacker)</h4>
                    
                </div>
                
            </section>
        </>
    )
};

export default Famille;
