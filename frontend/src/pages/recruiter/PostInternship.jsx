import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recruiterInternshipApi } from "../../api/internships";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { DOMAINS } from "../../utils/constants";

const INITIAL_FORM = {
  title: "",
  domain: DOMAINS[0],
  description: "",
  stipend: "",
  location: "",
  deadline: "",
};

export default function PostInternship() {
  const { token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await recruiterInternshipApi.create(
        {
          ...form,
          stipend: form.stipend === "" ? 0 : Number(form.stipend),
          location: form.location.trim() || "Remote",
        },
        token
      );
      toast.success("Internship posted");
      navigate("/recruiter/listings");
    } catch (err) {
      toast.error("Could not post internship");
    }
  }

  return (
    <section style={{ padding: "40px 50px", maxWidth: 600 }}>
      <h2>Post an Internship</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
        <select value={form.domain} onChange={(e) => update("domain", e.target.value)}>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          required
        />
        <input
          placeholder="Stipend"
          type="number"
          value={form.stipend}
          onChange={(e) => update("stipend", e.target.value)}
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => update("deadline", e.target.value)}
          required
        />
        <button className="btn" type="submit">Post Internship</button>
      </form>
    </section>
  );
}
