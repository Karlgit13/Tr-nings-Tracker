import React, { useState } from "react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    console.log("Validating form");
    if (!name || !password || !email) setError("Alla fält måste fyllas i.");
    else if (password.length < 6)
      setError("Lösenordet måste vara minst 6 tecken långt.");
    else if (!email.includes("@")) setError("E-postadressen är inte giltig.");
    else setError("");

    console.log("Form validation result", !error);
    return !error;
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted");
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Sending request to /api/register");
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      });
      console.log("Response received", response);
      if (response.ok) {
        console.log("Registration successful");
        setName("");
        setPassword("");
        setEmail("");
        alert("Registrering lyckades");
      } else {
        console.log("Registration failed");
        const data = await response.json();
        console.log("Error data", data);
        setError(data.message);
      }
    } catch (error) {
      console.error("Ett fel uppstod", error);
      console.log(error.response);
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
            minLength="6"
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
