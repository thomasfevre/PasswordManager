import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Main } from "./components/main.js";
import { HomePage } from "./components/home";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/PasswordManager" element={<HomePage />}/>
          <Route path="/main" element={<Main />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;