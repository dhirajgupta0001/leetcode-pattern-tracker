import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Navbar from "../components/Navbar";


const STORAGE_KEY = "lc-tracker:v1";

const DIFFICULTY_COLORS = {
  Easy: "from-emerald-500/20 to-emerald-400/10 border-emerald-400/30",
  Medium: "from-amber-500/20 to-amber-400/10 border-amber-400/30",
  Hard: "from-rose-500/20 to-rose-400/10 border-rose-400/30",
};

const DEFAULT_PATTERNS = [
  "Sliding Window",
  "Two Pointers",
  "Binary Search",
  "Greedy",
  "Backtracking",
  "DP",
  "Graphs",
  "Trees",
  "Stacks",
  "Queues",
];

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function ComplexityBadge({ label }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
      {label}
    </span>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/10"
    >
      {copied ? "Copied" : "Copy Code"}
    </button>
  );
}

function CodeBlock({ code, language = "javascript" }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);
  return (
    <pre className="relative rounded-xl overflow-hidden bg-black/60 border border-white/10">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton text={code} />
      </div>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}

function PatternCloud({ patterns, active, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {patterns.map((p) => {
        const isActive = active.includes(p);
        return (
          <button
            key={p}
            onClick={() => onToggle(p)}
            className={`px-3 py-1.5 rounded-full border text-sm transition backdrop-blur-md ${
              isActive
                ? "bg-white/20 border-white/30"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

function Progress({ items }) {
  const byPattern = useMemo(() => {
    const m = {};
    items.forEach((i) => {
      m[i.pattern] = (m[i.pattern] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [items]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {byPattern.map(([p, count]) => (
        <div
          key={p}
          className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="text-sm opacity-70">{p}</div>
          <div className="text-2xl font-semibold">{count}</div>
        </div>
      ))}
      {byPattern.length === 0 && (
        <div className="opacity-60">Add problems to see progress.</div>
      )}
    </div>
  );
}

function Card({ item, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-2xl p-5 bg-gradient-to-br ${DIFFICULTY_COLORS[item.difficulty]} backdrop-blur-md border shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline opacity-80"
          >
            LeetCode
          </a>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
              {item.difficulty}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
              {item.pattern}
            </span>
            {item.time && <ComplexityBadge label={`Time: ${item.time}`} />}
            {item.space && <ComplexityBadge label={`Space: ${item.space}`} />}
          </div>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="text-xs opacity-70 hover:opacity-100"
        >
          Delete
        </button>
      </div>

      {item.aha && (
        <div className="mt-3 text-sm opacity-90">
          <span className="opacity-70">Aha! </span>
          {item.aha}
        </div>
      )}

      {item.insight && (
        <div className="mt-2 text-sm opacity-80">{item.insight}</div>
      )}

      {item.code && (
        <div className="mt-4">
          <CodeBlock code={item.code} />
        </div>
      )}
    </motion.div>
  );
}

export default function Tracker() {
  const [items, setItems] = useLocalStorage(STORAGE_KEY, []);
  const [activePatterns, setActivePatterns] = useState([]);

  const [form, setForm] = useState({
    name: "",
    difficulty: "Easy",
    url: "",
    pattern: DEFAULT_PATTERNS[0],
    insight: "",
    aha: "",
    time: "",
    space: "",
    code: "",
  });

  const filtered = useMemo(() => {
    if (activePatterns.length === 0) return items;
    return items.filter((i) => activePatterns.includes(i.pattern));
  }, [items, activePatterns]);

  const allPatterns = useMemo(() => {
    const s = new Set([...DEFAULT_PATTERNS, ...items.map((i) => i.pattern)]);
    return Array.from(s);
  }, [items]);

  const addItem = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setItems([
      {
        ...form,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
      ...items,
    ]);
    setForm({
      name: "",
      difficulty: "Easy",
      url: "",
      pattern: DEFAULT_PATTERNS[0],
      insight: "",
      aha: "",
      time: "",
      space: "",
      code: "",
    });
  };

  const togglePattern = (p) => {
    setActivePatterns((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
    <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold">LeetCode Pattern Tracker</h1>
          <p className="opacity-70">Dark, glassy, and actually useful for mastering patterns.</p>
        </header>

        <section className="mb-8">
          <h2 className="text-lg mb-3">Progress by Pattern</h2>
          <Progress items={items} />
        </section>

        <section className="mb-8 rounded-3xl p-5 bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-lg mb-4">Add Solved Problem</h2>
          <form onSubmit={addItem} className="grid md:grid-cols-3 gap-4">
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Question Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              placeholder="LeetCode URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              value={form.pattern}
              onChange={(e) => setForm({ ...form, pattern: e.target.value })}
            >
              {allPatterns.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Time Complexity e.g. O(n)"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Space Complexity e.g. O(1)"
              value={form.space}
              onChange={(e) => setForm({ ...form, space: e.target.value })}
            />
            <textarea
              className="md:col-span-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Key Insight / Notes"
              value={form.insight}
              onChange={(e) => setForm({ ...form, insight: e.target.value })}
            />
            <textarea
              className="md:col-span-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Aha! Moment (the logic leap)"
              value={form.aha}
              onChange={(e) => setForm({ ...form, aha: e.target.value })}
            />
            <textarea
              className="md:col-span-3 font-mono text-sm bg-black/50 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Paste your optimal solution code here"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <div className="md:col-span-3">
              <button className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20">
                Add
              </button>
            </div>
          </form>
        </section>

        <section className="mb-6">
          <h2 className="text-lg mb-3">Filter by Pattern</h2>
          <PatternCloud
            patterns={allPatterns}
            active={activePatterns}
            onToggle={togglePattern}
          />
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item) => (
              <Card key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
