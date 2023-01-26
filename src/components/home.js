import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export function HomePage() {
  return (
    <div>
      <h1>Home Page!</h1>
      <Link to="/main">To main</Link>
    </div>
  );
}