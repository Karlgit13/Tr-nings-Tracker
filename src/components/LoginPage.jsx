import React, { useState } from "react";
import { useMuscle } from "./MuscleContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsloggedIn } = useMuscle();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        // Uppdaterad till serverlös funktion på Vercel
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Inloggning lyckades", data);
        setIsloggedIn(true);
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Ett fel uppstod", error);
      setError("Ett fel uppstod vid inloggning.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <label>
          Email:
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Lösenord:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          className="bg-red-500 text-white p-2 rounded text-lg hover:bg-red-700 transition-colors cursor-pointer"
          type="submit"
        >
          Logga in
        </button>
      </form>
      <div>
        <Link to={"/"}>
          <button className="bg-red-500 text-white p-2 rounded text-lg hover:bg-red-700 transition-colors cursor-pointer">
            back
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
