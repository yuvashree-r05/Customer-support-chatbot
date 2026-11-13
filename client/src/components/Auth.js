
import { useState } from "react";
import {
  Headphones,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../api";
import "../styles/Auth.css";


function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "signup";

      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await api.post(
  `${API_URL}/auth/${endpoint}`,
  payload
);

      onAuthSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-icon">
            <Headphones size={25} />
          </div>
          <h2>Support AI</h2>
          <p>Customer Support Assistant</p>
        </div>

        <div className="auth-heading">
          <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p>
            {isLogin
              ? "Login to continue to your account."
              : "Sign up to get started with Support AI."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setPassword("");
              setShowPassword(false);
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
