import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Hero */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Master LeetCode <span className="text-white/70">Patterns</span>, Not Just Problems.
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10">
          A personal DSA tracker built with React, Tailwind, and Framer Motion to help you
          learn by patterns, capture your “Aha!” moments, and track real progress.
        </p>

        <div className="flex gap-4 mb-20">
          <Link
            to="/app"
            className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 transition"
          >
            Open App →
          </Link>
          <a
            href="https://github.com/dhirajgupta0001/leetcode-pattern-tracker"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            View Code
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Pattern-based tracking",
            "Aha! moment notes",
            "Code snippets with copy",
            "Progress by pattern",
            "LocalStorage persistence",
            "Clean, glassy dark UI",
          ].map((f) => (
            <div
              key={f}
              className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <p className="text-lg">{f}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 text-white/50">
          <p>
            Built by Dhiraj Gupta as a portfolio project. React • Tailwind • Framer Motion • Vite
          </p>
        </div>
      </div>
    </div>
  );
}
