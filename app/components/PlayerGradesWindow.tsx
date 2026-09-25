"use client";
import { useEffect, useMemo, useState } from "react";

/** One scored player, as emitted by the model's 06_inference.py. */
interface Player {
  name: string;
  pos: string;
  team: string;
  age: number | null;
  games: number | null;
  ppg: number | null;
  rookie: boolean;
  rs: number | null; // redraft score 0-100
  rr: number | null; // redraft rank within position
  rp: number | null; // redraft projected PPR
  ds: number | null; // dynasty score 0-100
  dr: number | null;
  dp: number | null;
}

interface Payload {
  as_of_season: number;
  for_season: number;
  count: number;
  players: Player[];
}

type Target = "redraft" | "dynasty";
type PosFilter = "ALL" | "QB" | "RB" | "WR" | "TE";

const POSITIONS: PosFilter[] = ["ALL", "QB", "RB", "WR", "TE"];

/** Win95-era ramp: green = elite, amber = middling, red = replacement. */
function scoreColor(score: number): string {
  if (score >= 85) return "#008000";
  if (score >= 70) return "#3c8000";
  if (score >= 50) return "#806000";
  if (score >= 25) return "#804000";
  return "#800000";
}

export default function PlayerGradesWindow() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<Target>("redraft");
  const [pos, setPos] = useState<PosFilter>("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/data/player-scores.json")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((p: Payload) => { if (!cancelled) setData(p); })
      .catch((e: Error) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    const scoreOf = (p: Player) => (target === "redraft" ? p.rs : p.ds);
    const q = query.trim().toLowerCase();
    return data.players
      .filter(p => pos === "ALL" || p.pos === pos)
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q))
      .filter(p => scoreOf(p) !== null)
      .sort((a, b) => (scoreOf(b) ?? 0) - (scoreOf(a) ?? 0));
  }, [data, target, pos, query]);

  if (error) {
    return (
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, padding: 12 }}>
        <div style={{ background: "#800000", color: "#fff", padding: "4px 8px", marginBottom: 8 }}>
          ⚠ Could not load player scores
        </div>
        <div style={{ fontSize: 11, color: "#555" }}>
          {error} — expected <code>/data/player-scores.json</code>.
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, padding: 20, textAlign: "center", color: "#555" }}>
        ⏳ Loading player grades…
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#000", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Explainer */}
      <div style={{ background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 11, marginBottom: 8 }}>
        ▌ PLAYER GRADES — end of {data.as_of_season}, values for the {data.for_season} season
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
        {(["redraft", "dynasty"] as Target[]).map(t => (
          <button
            key={t}
            className="win95-button"
            style={{ fontSize: 11, padding: "2px 10px", background: target === t ? "#b8b8b8" : "var(--win95-gray)" }}
            onClick={() => setTarget(t)}
          >
            {t === "redraft" ? "📅 Redraft" : "🏛 Dynasty"}
          </button>
        ))}
        <span style={{ width: 8 }} />
        {POSITIONS.map(p => (
          <button
            key={p}
            className="win95-button"
            style={{ fontSize: 11, padding: "2px 8px", background: pos === p ? "#b8b8b8" : "var(--win95-gray)" }}
            onClick={() => setPos(p)}
          >
            {p}
          </button>
        ))}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search player / team…"
          style={{
            marginLeft: "auto", fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
            padding: "3px 6px", border: "2px inset #808080", background: "#fff", width: 150,
          }}
        />
      </div>

      <div style={{ fontSize: 11, color: "#555", marginBottom: 6, lineHeight: 1.5 }}>
        {target === "redraft"
          ? "Projected value for the upcoming season only (PPR points in the next season)."
          : "Discounted value over the next 3 seasons (γ = 0.75)."}
        {" "}Scores are 0–100 percentile ranks <b>within position</b>.
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "34px 1fr 46px 38px 42px 108px 62px 56px",
        background: "#c0c0c0", padding: "4px 6px", fontSize: 10, fontWeight: "bold",
        borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
        borderRight: "2px solid #404040", borderBottom: "2px solid #404040",
        gap: 4,
      }}>
        <span>#</span>
        <span>Player</span>
        <span>Team</span>
        <span>Pos</span>
        <span>Age</span>
        <span>Score</span>
        <span style={{ textAlign: "right" }}>Proj</span>
        <span style={{ textAlign: "right" }}>PPG</span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: "auto", border: "2px inset #808080", background: "#fff", minHeight: 120 }}>
        {rows.length === 0 && (
          <div style={{ padding: 16, fontSize: 11, color: "#666", textAlign: "center" }}>
            No players match “{query}”.
          </div>
        )}
        {rows.map((p, i) => {
          const score = (target === "redraft" ? p.rs : p.ds) ?? 0;
          const proj = target === "redraft" ? p.rp : p.dp;
          return (
            <div
              key={`${p.name}-${p.team}-${i}`}
              style={{
                display: "grid", gridTemplateColumns: "34px 1fr 46px 38px 42px 108px 62px 56px",
                padding: "3px 6px", fontSize: 11, alignItems: "center", gap: 4,
                background: i % 2 ? "#f4f4f4" : "#fff", borderBottom: "1px solid #eee",
              }}
            >
              <span style={{ color: "#666" }}>{i + 1}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}{p.rookie && <span style={{ color: "#000080", fontSize: 9 }}> ★R</span>}
              </span>
              <span style={{ color: "#444" }}>{p.team}</span>
              <span style={{ color: "#444" }}>{p.pos}</span>
              <span style={{ color: "#444" }}>{p.age ?? "-"}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ flex: 1, height: 9, background: "#ddd", border: "1px solid #999" }}>
                  <span style={{ display: "block", width: `${score}%`, height: "100%", background: scoreColor(score) }} />
                </span>
                <b style={{ width: 30, textAlign: "right", color: scoreColor(score) }}>{score.toFixed(1)}</b>
              </span>
              <span style={{ textAlign: "right", color: "#444" }}>{proj ?? "-"}</span>
              <span style={{ textAlign: "right", color: "#444" }}>{p.ppg ?? "-"}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 6, fontSize: 10, color: "#666", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span>{rows.length} of {data.count} players</span>
        <span>★R = incoming rookie</span>
        <span>Proj = projected PPR points</span>
        <span>PPG = last season&apos;s PPR per game</span>
      </div>
    </div>
  );
}
