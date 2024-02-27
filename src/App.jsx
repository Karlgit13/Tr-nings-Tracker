import React from "react";
import MainComponent from "./components/MainComponent";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import SavedData from "./components/SavedData";

function App() {
  return (
    <div className="App text-base md:text-lg font-serif">
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/data" element={<SavedData />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
