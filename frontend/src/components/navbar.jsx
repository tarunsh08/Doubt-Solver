import { Link, useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ui/theme-toggle-button"

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="navbar bg-base-200 flex justify-between items-center gap-4 px-3 py-2">

<div className="flex-1">
  <Link
    to="/"
    className="relative text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient"
  >
    Helping Hand
  </Link>
</div>

      <div className="flex gap-2 items-center">
        {!token ? (
          <>
          <ThemeToggleButton variant="gif" url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHRkYXNxZG4xZnJ2ZzA2MGxrcWltdmQ0ZTVvanV4dnBrd2hqYzZudSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/JqzFDGmh9ElmF9JDbE/giphy.gif" />
            <Link to="/signup" className="btn btn-sm cursor-pointer bg-blue-600 px-2 py-1 rounded-xl text-center hover:bg-blue-400 transition-colors">
              Signup
            </Link>
            <Link to="/login" className="btn btn-sm cursor-pointer bg-blue-600 px-2 py-1 rounded-xl text-center hover:bg-blue-400 transition-colors">
              Login
            </Link>
          </>
        ) : (
          <>
          <div className="flex gap-4 items-center">
            <p className="bg-gray-500 px-2 py-1 rounded-lg text-center hover:bg-gray-600 transition-colors">Hi, {user?.email}</p>
            {user && user?.role === "admin" ? (
              <Link to="/admin" className="btn btn-sm cursor-pointer hover:bg-blue-400 transition-colors">
                Admin
              </Link>
            ) : null}
            <ThemeToggleButton variant="gif" url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHRkYXNxZG4xZnJ2ZzA2MGxrcWltdmQ0ZTVvanV4dnBrd2hqYzZudSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/JqzFDGmh9ElmF9JDbE/giphy.gif" />
            <button onClick={logout} className="btn btn-sm bg-red-500 px-2 py-1 rounded-xl text-center cursor-pointer hover:bg-red-400 transition-colors">
              Logout
            </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}