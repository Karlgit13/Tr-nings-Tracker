import React, { useState } from "react";
import { useMuscle } from "./MuscleContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

function LoginPage() {
  const navigate = useNavigate();
  const { setIsloggedIn } = useMuscle();
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
    <div className="LoginPage">
      <Header />
      <div className="flex flex-col h-screen justify-center place-items-center">
        <h1 className="p-2 text-white font-serif">Logga in</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-1 w-4/5 max-w-xs mb-24"
        >
          {error && <p>{error}</p>}
          <input
            className="p-2 rounded"
            placeholder="E-post"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-2 rounded"
            placeholder="Lösenord"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="red-button" type="submit">
            Logga in
          </button>
          <Link to={"/"}>
            <button className="red-button w-full">Tillbaka</button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
