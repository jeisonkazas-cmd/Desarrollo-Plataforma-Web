import React, { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    setLoading(true);
    const url = `http://localhost:3000/auth/login?login_hint=${encodeURIComponent(
      email
    )}`;
    window.location.href = url;
  };

  return (
    <div className="login-container">
      <h1 className="text-2xl font-bold text-center">Bienvenido</h1>

      <div className="login-form-wrapper">
        <div className="field">
          <label className="field-label">Correo electrónico</label>
          <input
            type="email"
            className="field-input"
            placeholder="usuario@uniajc.edu.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="primary-btn w-full"
          onClick={handleLogin}
          disabled={loading || !email}
        >
          {loading ? "Redirigiendo..." : "Iniciar sesión"}
        </button>
      </div>

      <div className="login-footer-section">
        <img src="/UNIAJC.png" alt="Logo UNIAJC" className="login-logo-footer" />
        <p className="login-footer">Plataforma Académica UNIAJC</p>
      </div>
    </div>
  );
}
