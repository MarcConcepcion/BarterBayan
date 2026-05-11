import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiPost } from "../../utils/api";
import "./Login.css";
 
export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,  setForm]  = useState({ email: "", password: "" });
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = await apiPost("/auth/login.php", form);
    if (data.success) {
      login(data);
      navigate("/home");
    } else {
      setError(data.message);
    }
  };
 
 return (
    <div className="auth-screen">
      <div className="auth-card">
        {/* Brand icon — replace emoji with your SVG when ready */}
        <div className="auth-brand-icon">&#x21BB;</div>
        <h1 className="auth-logo">BarterBayan</h1>
        <p className="auth-tagline">The Community Barter Network.</p>
        <span className="auth-pill">Swap, Don't shop!</span>
 
        {error && <p className="auth-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field-group">
            <label className="auth-label">Email Address:</label>
            <input className="form-field" type="email" name="email"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="auth-field-group">
            <label className="auth-label">Password:</label>
            <input className="form-field" type="password" name="password"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary">Sign In to Trade</button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">Join the Community</Link>
        </p>
      </div>
    </div>
  );

}
