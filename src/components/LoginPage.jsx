import React, { useState } from "react";

function LoginPage() {
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
        // Hantera framgångsrik inloggning här
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
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default LoginPage;
