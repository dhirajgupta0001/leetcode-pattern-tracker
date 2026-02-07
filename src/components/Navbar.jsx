import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition border ${
      location.pathname === path
        ? "bg-white/20 border-white/30"
        : "bg-white/5 border-white/10 hover:bg-white/10"
    }`;

  return (
    <nav className="w-full border-b border-white/10 backdrop-blur-md bg-black/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          LeetCode Tracker
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/app" className={linkClass("/app")}>
            App
          </Link>

          {/* GitHub Button */}
          <a
            href="https://github.com/dhirajgupta0001/leetcode-pattern-tracker"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg transition border bg-white/5 border-white/10 hover:bg-white/10"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
