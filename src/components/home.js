import React from "react";
import { Link } from "react-router-dom";
import './css/home.css';
import { Footer } from './footer';

export function HomePage() {
    document.addEventListener("mousemove", parallax);
    function parallax(e){
      document.querySelectorAll(".object").forEach(function(move){

        var moving_value = move.getAttribute("data-value");
        var x = (e.clientX * moving_value) / 200;
        var y = (e.clientY * moving_value) / 200;

        move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
      });
    }

    const handleClickScroll = () => {
      const element = document.getElementById('page-1');
      if (element) {
        // 👇 Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
        <>
        <div className="page-0">
            {/* <h2 className="object" data-value="3"><Link to="/main">To main</Link></h2> */}
            
              <h2 className="object" data-value="3" >Password Manager</h2>
              
              <button className="btn-scroll object" data-value="4" onClick={handleClickScroll}>
                Get Started
              </button>
            <img src={require("../images/1.png")} className="object" data-value="-2" alt=""/>
            <img src={require("../images/2.png")} className="object" data-value="6" alt=""/>
            <img src={require("../images/3.png")} className="object" data-value="4" alt=""/>
            <img src={require("../images/4.png")} className="object" data-value="-6" alt=""/>
            <img src={require("../images/5.png")} className="object" data-value="8" alt=""/>
            <img src={require("../images/6.png")} className="object" data-value="-4" alt=""/>
            <img src={require("../images/7.png")} className="object" data-value="5" alt=""/>
            <img src={require("../images/8.png")} className="object" data-value="-9" alt=""/>
            <img src={require("../images/9.png")} className="object" data-value="-5" alt=""/>
        </div>
        <div className="page-1" id="page-1">

          <div className="page-header">
            <div className="align">
                <span className="red"></span>
                <span className="yellow"></span>
                <span className="green"></span>
            </div>

            <h1>What's the project ?
              <svg className="animate-bounce mt-2" viewBox="0 0 1024 1024"  version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#FFFFFF"></path></g></svg>            </h1>
            <p>
              The objective of this project is to provide a password manager using the blockchain. By encrypting their passwords with their wallet (their public key), everyone can save their confidential data on the blockchain without the risk of theft or forgetting.
            </p><br/>
            <p className="italic">This project is a proof of concept, and should not be considered as a real tool</p>
          </div>
          <div className="flex">
            <div className="card">
              <div className="card2">
                <h2>Easy</h2>
                <img className="-mt-6" src={require("../images/wallet2.png")} alt=""/>
              </div>
            </div>
            <div className="m-10"></div>
            <div className="card">
              <div className="card2">
                <h2>Safe</h2>
                <img src={require("../images/lock.png")} alt=""/>
              </div>
            </div>
            <div className="m-10"></div>
            <div className="card">
              <div className="card2">
                <h2>Decentralized</h2>
                <img className="mx-12 my-6" src={require("../images/blockchain.png")} width={100} alt=""/>
              </div>
            </div>
          </div>
          <button className="cssbuttons-io-button">Launch
            <div className="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
            </div>
          </button>
          <Footer />
        </div>
        
        </>
    );
}