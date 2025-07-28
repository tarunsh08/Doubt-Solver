import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); 
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Elaborate your Problem</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered border-2 border-gray-800 dark:border-gray-200 w-full px-4 py-2 rounded-xl"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered border-2 border-gray-800 dark:border-gray-200 w-full px-4 py-2 rounded-xl"
          required
        ></textarea>
        <button className="btn btn-primary cursor-pointer bg-fuchsia-500 px-5 py-2 rounded-xl hover:bg-fuchsia-600 transition-colors" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
      <div className="space-y-3 bg-gray-200 p-4 rounded-xl dark:bg-gray-800">
        {Array.isArray(tickets) && tickets.map((ticket) => (
          <Link
            key={ticket._id}
            className="card shadow-md p-4"
            to={`/tickets/${ticket._id}`}
          >
            <div className="flex flex-col gap-2">
            <h3 className="font-bold text-2xl uppercase">{ticket.title}</h3>
            <p className="text-sm">{ticket.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
            </div>
          </Link>
        ))}
        {!Array.isArray(tickets) && tickets.length === 0 && <p>No tickets submitted yet.</p>}
      </div>
    </div>
  );
}