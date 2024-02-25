import React, { useState } from "react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!name || !password || !email) {
      setError("Alla fält måste fyllas i.");
      return false;
    }
    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken långt.");
      return false;
    }
    if (!email.includes("@")) {
      setError("E-postadressen är inte giltig.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      });
      if (response.ok) {
        setName("");
        setPassword("");
        setEmail("");
        alert("Registrering lyckades");
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
        {error && <p>{error}</p>}
        <label>
          Namn:
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Lösenord:
          <input
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            required
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
