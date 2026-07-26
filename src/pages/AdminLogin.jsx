import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "Abhi8084@#";

    setTimeout(() => {
      if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // ==========================================
        // SESSION LOGIN
        // Tab/browser session ke liye
        // Tab close hone par automatically remove
        // ==========================================

        sessionStorage.setItem("adminLoggedIn", "true");

        // Dashboard par redirect
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        setError("Invalid username or password");
      }

      setLoading(false);
    }, 500);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-background">
        <div className="login-circle circle-one"></div>
        <div className="login-circle circle-two"></div>
        <div className="login-circle circle-three"></div>
      </div>

      <div className="admin-login-card">
        {/* LOGO */}

        <div className="admin-login-logo">
          <div className="logo-icon">🌿</div>

          <h1>ST HERBAL</h1>

          <p>Admin Panel</p>
        </div>

        {/* HEADING */}

        <div className="admin-login-heading">
          <h2>Welcome Back</h2>

          <p>Login to access your admin dashboard</p>
        </div>

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>
          {/* ERROR */}

          {error && <div className="login-error">⚠️ {error}</div>}

          {/* USERNAME */}

          <div className="login-input-group">
            <label>Username</label>

            <div className="login-input-wrapper">
              <span>👤</span>

              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div className="login-input-group">
            <label>Password</label>

            <div className="login-input-wrapper">
              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "⏳ Logging in..." : "🔐 Login to Dashboard"}
          </button>
        </form>

        {/* FOOTER */}

        <div className="admin-login-footer">
          <span>🌿</span>

          <p>ST Herbal Care Admin Portal</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
