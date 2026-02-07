import { Link, useLocation } from "react-router-dom";

export default function Navbar({ items = [], setItems }) {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition border ${
      location.pathname === path
        ? "bg-white/20 border-white/30"
        : "bg-white/5 border-white/10 hover:bg-white/10"
    }`;

  // 📤 Export handler
  const exportData = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leetcode-tracker-backup.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  // 📥 Import handler
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (!Array.isArray(parsed)) {
          alert("Invalid backup file format.");
          return;
        }

        setItems(parsed);
        alert("Data imported successfully!");
      } catch (err) {
        alert("Failed to read file. Make sure it's a valid JSON backup.");
      }
    };

    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

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

          {/* Export */}
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg transition border bg-white/5 border-white/10 hover:bg-white/10"
          >
            Export
          </button>

          {/* Import */}
          <label className="px-4 py-2 rounded-lg transition border bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer">
            Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={importData}
            />
          </label>

          {/* GitHub */}
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
