import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './css/home.css';

export function HomePage() {
    document.addEventListener("mousemove", parallax);
    function parallax(e){
      document.querySelectorAll(".object").forEach(function(move){

        var moving_value = move.getAttribute("data-value");
        var x = (e.clientX * moving_value) / 250;
        var y = (e.clientY * moving_value) / 250;

        move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
      });
    }

    return (
       
        <div className="container">
            <h2 className="object" data-value="3"><Link to="/main">To main</Link></h2>
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
    );
}