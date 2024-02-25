import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Inloggning lyckades", data);
        // Spara den inloggade användarens data, t.ex. i en global state eller i localStorage
      } else {
        setError(data.message); // Antag att servern skickar tillbaka ett felmeddelande
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
          Email
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
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default LoginPage;
