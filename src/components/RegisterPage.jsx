import React, { useState } from "react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      });
      if (response.ok) {
        console.log("Registrering lyckades");
        // Hantera vidare logik här, t.ex. omdirigera användaren
      } else {
        console.error("Registrering misslyckades");
      }
    } catch (error) {
      console.error("Ett fel uppstod", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Namn:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Lösenord:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Registrera</button>
      </form>
    </div>
  );
}

export default RegisterPage;
