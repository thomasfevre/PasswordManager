import React from "react";
import { Link } from "react-router-dom";
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
                <img src={require("../images/down-arrow.png")} alt="down arrows" width={300} height={300}/>
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
        <div className="page-1" id="page-1">Section 1</div>
        </>
    );
}