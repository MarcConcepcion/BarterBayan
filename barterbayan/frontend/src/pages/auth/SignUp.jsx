import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../../utils/api";
import "./SignUp.css";
 
export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ username:"", email:"", password:"", location:"" });
  const [error, setError] = useState("");
  const [done,  setDone]  = useState(false);
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = await apiPost("/auth/register.php", form);
    if (data.success) {
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(data.message);
    }
  };
 
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-logo">BarterBayan</h1>
        <p className="auth-sub">Create your account</p>
        {done  && <p className="auth-success">Registered! Redirecting to login...</p>}
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="form-field" name="username" placeholder="Username"
            value={form.username} onChange={handleChange} required />
          <input className="form-field" type="email" name="email" placeholder="Email"
            value={form.email}    onChange={handleChange} required />
          <input className="form-field" type="password" name="password" placeholder="Password"
            value={form.password} onChange={handleChange} required />
          <input className="form-field" name="location" placeholder="Your location (optional)"
            value={form.location} onChange={handleChange} />
          <button type="submit" className="btn-primary" style={{ marginTop:"12px" }}>
            Create Account
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
