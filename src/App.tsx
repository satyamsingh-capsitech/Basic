import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute"; 

function App() {
  return (
    <Router>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Login />} />

        
          <Route element={<PrivateRoute />}>
            <Route path="/navigate" element={<Navigation />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
