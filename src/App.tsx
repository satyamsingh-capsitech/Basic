import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import BasicForm from "./BasicForm";
import Navigation from "./Navigation";
import Pdf from "./Pdf";
import Login from "./Login";

function App() {
  return (
    <>
      <Router>
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/navigate" element={<Navigation />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
