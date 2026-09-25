"use client";
import { useState } from "react";
import SnakeGame from "./SnakeGame";
import PongGame from "./PongGame";

type GameTab = "menu" | "snake" | "pong" | "madden99";

interface Game {
  id: GameTab;
  icon: string;
  name: string;
  desc: string;
  /** Path to an embedded build served from /public. Runs inline in an iframe. */
  embed?: string;
  /** Source repo — surfaced as a "GitHub" link alongside the game. */
  url?: string;
}

export default function FunWindow() {
  const [tab, setTab] = useState<GameTab>("menu");

  const games: Game[] = [
    { id: "snake", icon: "🐍", name: "Snake", desc: "Classic snake game. Eat the food, don't eat yourself!" },
    { id: "pong", icon: "🏓", name: "Pong", desc: "Two-player Pong. P1 uses W/S, P2 uses arrow keys." },
    {
      id: "madden99",
      icon: "🏈",
      name: "Madden 99",
      desc: "NFL roster-building spin game. Spin a season and division, then draft a skill-position core and chase a 99-overall team.",
      embed: "/madden/",
      url: "https://github.com/NotABot122/madden-99-game",
    },
  ];

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, marginBottom: 8, flexWrap: "wrap" }}>
        <button
          className="win95-button"
          style={{ fontSize: 11, padding: "2px 10px", background: tab === "menu" ? "#b8b8b8" : "var(--win95-gray)" }}
          onClick={() => setTab("menu")}
        >
          🎮 Games
        </button>
        {games.map(g => (
          <button
            key={g.id}
            className="win95-button"
            style={{ fontSize: 11, padding: "2px 10px", background: tab === g.id ? "#b8b8b8" : "var(--win95-gray)" }}
            onClick={() => setTab(g.id)}
          >
            {g.icon} {g.name}
          </button>
        ))}
      </div>

      {tab === "menu" && (
        <div className="animate-fadein">
          <div style={{ background: "#000080", color: "#fff", padding: "2px 8px", fontSize: 11, marginBottom: 12 }}>
            ▌ GAME LIBRARY — Select a game to play
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {games.map(g => (
              <div
                key={g.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: 12,
                  background: "#f0f0f0", border: "2px solid #808080", cursor: "pointer"
                }}
                onClick={() => setTab(g.id)}
                onMouseEnter={e => (e.currentTarget.style.background = "#000080")}
                onMouseLeave={e => (e.currentTarget.style.background = "#f0f0f0")}
              >
                <span style={{ fontSize: 32 }}>{g.icon}</span>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 14 }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{g.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  {g.url && (
                    <button
                      className="win95-button"
                      style={{ fontSize: 11, padding: "2px 8px" }}
                      onClick={e => { e.stopPropagation(); window.open(g.url, "_blank"); }}
                    >
                      GitHub
                    </button>
                  )}
                  <button className="win95-button" style={{ fontSize: 12 }}>
                    ▶ Play
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 8, background: "#f0f0f0", border: "1px solid #ccc", fontSize: 11, color: "#666" }}>
            🕹️ More games coming soon! Check back later.
          </div>
        </div>
      )}

      {tab === "snake" && (
        <div className="animate-fadein" style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
          <SnakeGame />
        </div>
      )}

      {tab === "pong" && (
        <div className="animate-fadein" style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
          <PongGame />
        </div>
      )}

      {tab === "madden99" && (
        <div className="animate-fadein">
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
            background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 11,
          }}>
            <span>▌ MADDEN 99 — running inside Portfolio 95</span>
            <button
              className="win95-button"
              style={{ marginLeft: "auto", fontSize: 11, padding: "1px 8px", color: "#000" }}
              onClick={() => window.open("https://github.com/NotABot122/madden-99-game", "_blank")}
            >
              View on GitHub ↗
            </button>
          </div>
          <div style={{ border: "2px inset #808080", background: "#0a0e17" }}>
            <iframe
              src="/madden/"
              title="Madden 99"
              style={{ width: "100%", height: 460, border: "none", display: "block" }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#666" }}>
            💡 Tip: maximize this window for the best experience.
          </div>
        </div>
      )}
    </div>
  );
}
