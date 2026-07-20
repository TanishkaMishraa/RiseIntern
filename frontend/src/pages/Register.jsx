import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useToast } from "../hooks/useToast";
import { ROLES } from "../utils/constants";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: ROLES.STUDENT });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Account created — please log in");
      navigate("/login");
    } catch (err) {
      toast.error("Could not create account");
    }
  }

  return (
    <section className="hero">
      <div className="popup-content">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
          <select value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value={ROLES.STUDENT}>Student</option>
            <option value={ROLES.RECRUITER}>Recruiter</option>
          </select>
          <button className="btn" type="submit">Register</button>
        </form>
      </div>
    </section>
  );
}
