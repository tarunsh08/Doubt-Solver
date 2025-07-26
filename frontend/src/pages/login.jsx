import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error('Full error:', err);
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-xl bg-gray-200 rounded-2xl px-5 py-4 dark:bg-gray-800">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">Login</h2>

          <div className="space-y-2 flex flex-col gap-8 mt-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered rounded-xl px-5 py-2 border-2 border-gray-800 dark:border-gray-200"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered rounded-xl px-5 py-2 border-2 border-gray-800 dark:border-gray-200"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl bg-fuchsia-500 px-5 py-2 hover:bg-fuchsia-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}