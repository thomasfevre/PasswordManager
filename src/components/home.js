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
                <img src={require("../images/down-arrow2.png")} alt="down arrows" width='auto' height='auto'/>
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
        <button class="cssbuttons-io-button"> Get started
          <div class="icon">
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
          </div>
        </button>

        </div>
        </>
    );
}