"use client";
import { useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  /** Omitted for projects that aren't published to GitHub yet. */
  github?: string;
  demo?: string;
  status: "Complete" | "In Progress" | "WIP";
  icon: string;
  /** Optional bullet points surfaced in the detail view. */
  highlights?: string[];
  /** Opens an in-portfolio viewer window for this project's output. */
  viewer?: { label: string; kind: "grades" };
}

const PROJECTS: Project[] = [
  {
    id: 5,
    title: "ITPO — Inventory Tracking & Procurement Optimizer",
    description:
      "A multi-tenant SaaS, live in production, that turns raw stock movements into buy decisions for small and mid-size businesses: track SKUs, forecast demand from usage history, compute reorder points and EOQ, then generate purchase recommendations priced against the cheapest supplier it can find. The interesting half isn't the CRUD — it's the price pipeline. A scheduled scraper works cheapest-path-first, caching a verified CSS/JSON-LD selector per domain so every repeat scrape costs zero API credits, and falling back to a single schema-forced LLM extraction only when the free path fails. A discovery step goes further: for a SKU with no supplier at all, it searches Google Shopping, organic web and Tavily, and only ever creates a supplier once it has actually priced a real URL.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "PostgreSQL", "Trigger.dev", "Tailwind", "Recharts", "Zod", "Claude Code"],
    demo: "https://itpodeployment.vercel.app/",
    status: "In Progress",
    icon: "📦",
    highlights: [
      "Multi-tenant from the schema up — org_id plus Postgres Row Level Security on every table, so tenant isolation is enforced by the database rather than by application code",
      "The scraper spends LLM credits only on a domain's first visit: a selector is cached in domain_selectors and reused for free, and it is cached only if it actually reproduces the extracted price on the page",
      "Every scraped price passes a validation gate — non-positive, >500% swing vs. the last price, confidence below 0.6, or a currency mismatch all land as needs_review instead of quietly poisoning price history",
      "Politeness is built in: robots.txt parsed and cached per domain, a 2s per-domain rate limit, one concurrent scrape per domain via Trigger.dev concurrencyKey, and an extraction LLM with no tools that can only return JSON",
      "Forecasting is pure functions over stock history — 90-day rolling usage, safety stock = Z·σ·√lead time at a 95% service level, plus EOQ and a projected depletion date",
      "The procurement loop closes in-app: approve a recommendation, roll it into a purchase order, and export the PO or an inventory-valuation/spend report as PDF or CSV",
    ],
  },
  {
    id: 0,
    title: "NFL Fantasy Value Model",
    description:
      "A machine learning system that scores every fantasy-relevant NFL player (QB/RB/WR/TE) from 0–100 on two horizons: redraft (next season's PPR points) and dynasty (three discounted seasons). Built on 211 engineered features from 16 seasons of free nflverse data, with a LightGBM baseline benchmarked head-to-head against a career-sequence transformer in PyTorch. The hard part wasn't the models — it was proving no future information leaks into a feature, so every score is validated with walk-forward backtesting where the model is retrained from scratch for each test season.",
    tech: ["Python", "LightGBM", "PyTorch", "Polars", "NumPy", "nflreadpy", "Claude Code"],
    status: "Complete",
    icon: "🧠",
    viewer: { label: "📊 View Player Grades", kind: "grades" },
    highlights: [
      "Spearman ρ 0.741 (redraft) and 0.781 (dynasty), out-of-sample across 10 and 6 test seasons",
      "Automated leakage audit enforces truncation invariance — every feature rebuilt from a season-truncated panel must be bit-identical",
      "Transformer lost to the GBM by 0.09–0.20 ρ at this data scale; reported honestly instead of tuned until it won",
      "Found the LightGBM huber default was fitting the median and collapsing predictions to a [34, 83] band — switching to L2 on √PPR cut MAE from 50.8 to 29.6",
      "Calibrated scores: a 90+ finishes top-decile 39% of the time; 44–52% top-12 hit rate, in line with published benchmarks",
    ],
  },
  {
    id: 4,
    title: "Vision Rock Paper Scissors",
    description:
      "A physical game of rock paper scissors played against the computer through a webcam. MediaPipe's hand landmarker tracks 21 points on your hand in real time, and a rule-based classifier reads your throw from finger geometry — no training data required. The part that makes it feel like the real game is the pump detector: a state machine watching wrist velocity counts the three fist pumps you'd actually do in person, then freezes for 1.5 seconds so you have to commit to your throw before the CPU reveals its own.",
    tech: ["Python", "OpenCV", "MediaPipe", "NumPy", "Claude Code"],
    github: "https://github.com/NotABot122/PythonRockPaperScissors",
    status: "Complete",
    icon: "✌️",
    highlights: [
      "Real-time hand tracking at 21 landmarks via MediaPipe HandLandmarker in VIDEO mode",
      "Gesture classifier compares each fingertip against its PIP joint — rock, paper and scissors from pure geometry, no ML training",
      "Pump detector is a velocity state machine with a threshold and 0.35s cooldown, so shaky hands don't false-trigger the countdown",
      "1.5s freeze window after the third pump prevents changing your throw after the reveal",
      "Live skeleton overlay plus a scoreboard panel drawn entirely with OpenCV primitives",
    ],
  },
  {
    id: 5,
    title: "Madden 99",
    description:
      "An NFL roster-building game where two wheels decide your fate and you decide the roster. Spin a season from 2001–2025 and a division, then draft a seven-man skill core — 1 QB, 2 HBs, 3 WRs and a TE — chasing the highest possible team overall. Built on real Madden ratings for every season, with three modes: Classic, Extreme (overalls hidden while you draft) and Hard (one team, one season, no division safety net). It runs inside this portfolio — open the Fun Zone, or hit Live Demo below.",
    tech: ["TypeScript", "Next.js", "React", "Tailwind", "Python", "Claude Code"],
    github: "https://github.com/NotABot122/madden-99-game",
    demo: "/madden/",
    status: "Complete",
    icon: "🏈",
    highlights: [
      "25 seasons of real Madden ratings, processed from raw CSVs into per-season JSON at build time",
      "Three difficulty modes built on one draft engine, varying what information you get to see",
      "Deployed as a static export mounted at /madden inside this portfolio, so it ships as one site",
      "Position-aware draft logic enforces the 7-man skill core with one respin per round",
    ],
  },
  {
    id: 6,
    title: "Beale Cipher Cryptanalysis",
    description:
      "A computational attack on the Beale Ciphers, a famously unsolved 19th-century book cipher. Only one of the three ciphers has ever been broken — using the Declaration of Independence as its key — leaving the other two open for 140 years. This project searches for the missing key texts at scale: it decodes candidate documents as book ciphers across every possible start offset, scores the resulting plaintext with a character-level language model, and analyses the numbering drift in the known solution to constrain what the remaining keys could look like.",
    tech: ["Python", "NumPy", "Statistics", "Cryptanalysis", "Claude Code"],
    status: "In Progress",
    icon: "🔐",
    highlights: [
      "Vectorised sliding-window search over 1.7 million start offsets across a 40-document candidate corpus",
      "Character-level language model scores decoded plaintext, with best-window scoring so partial matches still surface",
      "Drift analysis of cipher B2's known indexing errors against candidate key texts, ranked by Spearman correlation",
      "Generates a self-contained HTML report of exhibits and rankings for each run",
    ],
  },
];

const statusColors: Record<string, string> = {
  "Complete": "#008000",
  "In Progress": "#000080",
  "WIP": "#804000",
};

export default function ProjectsWindow({ onOpenGrades }: { onOpenGrades?: () => void }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [view, setView] = useState<"list" | "detail">("list");

  const openProject = (p: Project) => { setSelected(p); setView("detail"); };
  const goBack = () => { setView("list"); setSelected(null); };

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#000" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, alignItems: "center" }}>
        {view === "detail" && (
          <button className="win95-button" onClick={goBack} style={{ fontSize: 12, padding: "3px 10px" }}>
            ← Back
          </button>
        )}
        <div style={{ fontSize: 12, color: "#666", marginLeft: view === "detail" ? 8 : 0 }}>
          {view === "list" ? `${PROJECTS.length} project(s) found` : `Viewing: ${selected?.title}`}
        </div>
      </div>

      {view === "list" && (
        <div>
          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
            background: "#c0c0c0", padding: "4px 8px", fontSize: 11, fontWeight: "bold",
            borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
            borderRight: "2px solid #404040", borderBottom: "2px solid #404040",
            marginBottom: 2,
          }}>
            <span>Name</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {PROJECTS.map((project) => (
            <div
              key={project.id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
                padding: "6px 8px", marginBottom: 2, cursor: "pointer",
                background: "#fff", borderBottom: "1px solid #ddd",
                alignItems: "center",
              }}
              onDoubleClick={() => openProject(project)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#000080")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLDivElement).querySelectorAll("span, div").forEach(el => {
                  (el as HTMLElement).style.color = "#fff";
                });
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLDivElement).querySelectorAll("span, div").forEach(el => {
                  (el as HTMLElement).style.color = "";
                });
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{project.icon}</span>
                <span>{project.title}</span>
              </span>
              <span style={{ fontSize: 11, color: statusColors[project.status] }}>
                ● {project.status}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  className="win95-button"
                  style={{ fontSize: 11, padding: "2px 6px" }}
                  onClick={(e) => { e.stopPropagation(); openProject(project); }}
                >
                  Open
                </button>
                {project.github && (
                  <button
                    className="win95-button"
                    style={{ fontSize: 11, padding: "2px 6px" }}
                    onClick={(e) => { e.stopPropagation(); window.open(project.github, "_blank"); }}
                  >
                    GitHub
                  </button>
                )}
                {project.demo && (
                  <button
                    className="win95-button"
                    style={{ fontSize: 11, padding: "2px 6px" }}
                    onClick={(e) => { e.stopPropagation(); window.open(project.demo, "_blank"); }}
                  >
                    Live
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 8, background: "#f0f0f0", border: "1px solid #ccc", fontSize: 11, color: "#666" }}>
            💡 Double-click a project to view details. Links open in a new tab.
          </div>
        </div>
      )}

      {view === "detail" && selected && (
        <div className="animate-fadein">
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16, padding: 12, background: "#f0f0f0", border: "2px inset #808080" }}>
            <div style={{ fontSize: 48 }}>{selected.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontFamily: "'VT323', monospace", color: "#000080" }}>{selected.title}</div>
              <div style={{ fontSize: 11, color: statusColors[selected.status], marginTop: 4 }}>
                ● {selected.status}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ background: "#000080", color: "#fff", padding: "2px 8px", fontSize: 11, marginBottom: 6 }}>▌ DESCRIPTION</div>
            <p style={{ lineHeight: 1.8, paddingLeft: 8 }}>{selected.description}</p>
          </div>

          {selected.highlights && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ background: "#000080", color: "#fff", padding: "2px 8px", fontSize: 11, marginBottom: 6 }}>▌ HIGHLIGHTS</div>
              <ul style={{ lineHeight: 1.8, paddingLeft: 26, margin: 0 }}>
                {selected.highlights.map((h, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <div style={{ background: "#000080", color: "#fff", padding: "2px 8px", fontSize: 11, marginBottom: 6 }}>▌ TECHNOLOGIES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 8 }}>
              {selected.tech.map(t => (
                <span key={t} style={{ background: "#c0c0c0", padding: "2px 8px", fontSize: 11, border: "1px solid #808080" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ background: "#000080", color: "#fff", padding: "2px 8px", fontSize: 11, marginBottom: 8 }}>▌ LINKS</div>
            <div style={{ display: "flex", gap: 8, paddingLeft: 8, flexWrap: "wrap", alignItems: "center" }}>
              {selected.viewer?.kind === "grades" && onOpenGrades && (
                <button className="win95-button" onClick={onOpenGrades}>
                  {selected.viewer.label}
                </button>
              )}
              {selected.github && (
                <button className="win95-button" onClick={() => window.open(selected.github, "_blank")}>
                  📁 View on GitHub
                </button>
              )}
              {selected.demo && (
                <button className="win95-button" onClick={() => window.open(selected.demo, "_blank")}>
                  🌐 Live Demo
                </button>
              )}
              {!selected.github && !selected.demo && (
                <span style={{ fontSize: 11, color: "#666" }}>
                  Source not published yet — available on request.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
