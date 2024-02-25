import React from "react";
import MainComponent from "./components/MainComponent";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
