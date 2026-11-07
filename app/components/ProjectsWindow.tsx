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
  /** Standout work — renders a star beside the title in both views. */
  featured?: boolean;
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
      "A stock-and-ordering tool for small and mid-size businesses, live and in use today. It watches what a business gets through, works out when each item will run out, and says how much to reorder and who to buy it from, priced against the cheapest supplier it can find online. The interesting half isn't the record-keeping, it's how it finds those prices. A background job checks supplier pages on a schedule, and the first time it visits a site it figures out where on the page the price lives and remembers the spot, so every later check costs nothing. It only pays for an AI read when a page it has never seen defeats it. For an item with no supplier at all, it goes looking across shopping and web search, and refuses to add one until it has found and confirmed a real price on a real page.",
    tech: ["Next.js 16", "TypeScript", "Supabase", "PostgreSQL", "Trigger.dev", "Tailwind", "Recharts", "Zod", "Claude Code"],
    demo: "https://itpodeployment.vercel.app/",
    status: "In Progress",
    icon: "📦",
    featured: true,
    highlights: [
      "Several companies share one system without ever seeing each other's data, and the database itself enforces that on every table — so a mistake in the app code can't leak one customer's figures to another",
      "Reading a supplier's site costs money once and nothing afterwards, and the shortcut it remembers is only kept if it actually finds the same price again on the live page",
      "Prices that look wrong are held back for a human instead of saved: anything zero or negative, anything more than five times the last price, anything in the wrong currency, and anything the reader wasn't confident about",
      "It behaves itself as a visitor — it reads and follows each site's rules for automated traffic, waits two seconds between requests, never hits the same site twice at once, and the AI step is boxed in so it can only read a page and hand back an answer",
      "Reorder points come from the last 90 days of usage plus a buffer sized so the business only runs short about one time in twenty, and every item gets a projected date it runs dry",
      "The loop finishes in one place: approve a suggestion, turn it into a purchase order, and export the order or a spend report as a PDF or a spreadsheet",
    ],
  },
  {
    id: 9,
    title: "Project Rubber Ducky — CodeAI Adaptive Learning Engine",
    description:
      "A coding tutor that adapts to each student, built with a team of six at the AWS Breaking Barriers Hackathon for CodeAI, a nonprofit that writes computer science lessons for schools. It goes after the problem teachers rank hardest: one classroom holds students who are lost, students who are keeping up and students who are bored, and one teacher can't be in three places. A student answers a short set of warm-up questions, and what those answers reveal shapes a real Python project they then build a level at a time — pulling data out of a database, if-statements, loops, functions. Every time they submit, their code is run and checked, and the result becomes feedback, a nudge, or an extra practice problem slotted in just before the level they're about to get stuck on. The rule the whole system is built around is that the AI is never the part holding it up: ordinary rules do the marking and decide what comes next, the AI sits on top as an optional extra, and anything it gets wrong falls back to a fixed path that still walks the student to the end of the lesson.",
    tech: ["Python", "TypeScript", "React 18", "MUI 7", "Blockly", "Amazon Bedrock", "Bedrock AgentCore", "Amazon S3 + KMS", "SQLite", "Kiro"],
    github: "https://github.com/NotABot122/project-rubber-ducky",
    status: "Complete",
    icon: "🦆",
    featured: true,
    highlights: [
      "My share of the six-way split was keeping student data safe and getting things running on AWS: the encrypted store student work is written to and the rules about who may open it, putting the warm-up quiz online behind a real login, turning our hand-written safety checks into a managed filter, and the cost comparison that settled which AI model the team used",
      "We broke it on purpose to see what happened. In 9 of 12 deliberate failures — a crash mid-lesson, a link to a problem that doesn't exist, a corrupted save, a grader that hangs, a dead AI — the student still reached the end of the lesson. The 2 that did crash are written up in the report rather than quietly dropped",
      "Marked against a human answer key on 25 submissions, the auto-grader agreed 92% of the time and never once failed work that deserved to pass. The 2 it wrongly passed had both followed the letter of the instructions and not the point of them, one by getting around a banned shortcut and spelling it a different way",
      "Tested against 40 simulated students, the warm-up quiz put 80% at exactly the right level and 99% within one level of it. Starting them there cut the average number of failed attempts from 1.7 to 1.35, and from 4.0 to 2.5 for the third who were struggling most, without handing extra practice to anyone who didn't need it",
      "Two separate filters check what students type, because neither was good enough alone: the hosted one caught 3 of 4 attempts to misuse the tutor and our own checks caught all 4, and between them they wrongly blocked none of 191 ordinary submissions",
      "The AI hints were judged honestly and lost on the thing that mattered most. They were far more accurate than the teacher-written backups, scoring 0.97 against 0.47, but they gave away the answer 69% of the time when the entire point was never to give it away",
      "Student work is encrypted under its own key, keeps every earlier version, and can only be reached over a secure connection. The access rules shut out even the admin account we were working from — checked against AWS's own permissions tester rather than assumed — and email addresses and phone numbers are stripped out of student code before anything is saved",
      "The warm-up quiz also runs as a hosted service behind a login, with the sign-in checked before a request reaches any of our code: no pass is turned away, a forged pass is turned away, and only a genuine one gets through",
      "Students can switch between typing code and dragging blocks in the middle of a problem. The conversion reads their code without ever running it, and anything the blocks can't represent yet comes back pointing at the line and saying why, instead of quietly disappearing",
      "303 tests on the Python side plus the ones covering the interface, and the whole thing runs on a laptop with no AWS account at all — switch the AI off and you get the plain-rules version, which is the same fallback the testing was built around",
    ],
  },
  {
    id: 0,
    title: "NFL Fantasy Value Model",
    description:
      "A system that grades every fantasy-relevant NFL player out of 100, twice over: once for how they should do next season, and once for what they're worth across the next three. It learns from 16 seasons of free public data, boiled down into 211 things worth knowing about a player, and puts two very different kinds of model head to head. The hard part turned out to be neither of them. It was proving that nothing a model sees about a player could only have been known afterwards — so every grade is checked by walking forward through history one season at a time, rebuilding the model from scratch before each one, leaving it to guess at a future it has genuinely never seen.",
    tech: ["Python", "LightGBM", "PyTorch", "Polars", "NumPy", "nflreadpy", "Claude Code"],
    status: "Complete",
    icon: "🧠",
    featured: true,
    viewer: { label: "📊 View Player Grades", kind: "grades" },
    highlights: [
      "On seasons it had never trained on, the order it ranked players in matched how they actually finished: 0.74 for next-season grades across 10 seasons, 0.78 for three-year value across 6",
      "An automatic check catches any statistic that accidentally peeks at the future — cut the data off at a given season, rebuild every number from scratch, and it has to come out exactly as it did before",
      "The fancier neural-network model lost to the simpler one, and by a clear margin at this amount of data. Reported as it came out rather than tuned until it won",
      "A default setting was quietly squashing every prediction into a narrow band in the middle of the range; changing how the model is scored while it trains cut the average error from 50.8 to 29.6",
      "The grades mean what they claim: a player graded 90 or above finishes in the top tenth of his position 39% of the time and in the top 12 about half the time, which is in line with published models",
    ],
  },
  {
    id: 4,
    title: "Vision Rock Paper Scissors",
    description:
      "A real game of rock paper scissors played against the computer through a webcam. It follows 21 points on your hand as you move and works out your throw purely from where your fingers sit — no training data, nothing learned, just geometry. What makes it feel like the real game is the pump detector: it watches your wrist rise and fall, counts the three pumps you'd actually do in person, then locks your answer in for a second and a half so you have to commit before the computer shows its hand.",
    tech: ["Python", "OpenCV", "MediaPipe", "NumPy", "Claude Code"],
    github: "https://github.com/NotABot122/PythonRockPaperScissors",
    status: "Complete",
    icon: "✌️",
    highlights: [
      "Follows 21 points on your hand live, frame by frame, straight from the webcam",
      "Reads your throw by checking whether each fingertip sits above or below its middle knuckle — rock, paper and scissors from geometry alone, with nothing trained on",
      "The pump counter waits for a genuine up-and-down motion and ignores anything within a third of a second of the last one, so a shaky hand doesn't start the countdown early",
      "Your throw is locked for a second and a half after the third pump, so you can't change it once you've seen what the computer played",
      "The hand outline and the scoreboard are both drawn straight onto the live video",
    ],
  },
  {
    id: 6,
    title: "Applied Analytics — Student Outcomes",
    description:
      "A look at what actually separates students who land a job placement from those who don't, across 5,000 student records and 18 things recorded about each one: earlier school results, university grades, technical and people-skill scores, internships, projects, attendance and failed subjects. The analysis works through it in deliberate passes — comparing every measure between students who were placed and students who weren't, checking which ones rise and fall together, pairing grades against technical skill, and looking at salary only among the students who actually got a job. The useful finding is as much about what doesn't matter as what does. School results from before university, the number of internships and the pile of certificates all turn out to mean essentially nothing, while failed subjects stand out as the single clearest warning sign.",
    tech: ["Python", "pandas", "Matplotlib", "seaborn"],
    status: "In Progress",
    icon: "🎓",
    highlights: [
      "5,000 students and 18 things recorded about each, but only 17.3% were placed — so every comparison sets a small group against a much larger one",
      "Failed subjects are the strongest signal in the data and they point downwards: the more a student has, the less likely a placement. They outrank university grades, then technical skill, then people skills",
      "School results from before university are effectively noise — exam scores, final-year marks and entrance test results all sit within a rounding error of no relationship at all",
      "Internships, projects, certificates and work experience come out just as flat, so the whole experience section mostly documents a non-result",
      "Salary is examined only among students who were placed. Including everyone else produces a spectacular-looking result that means nothing, because every unplaced student is recorded as earning zero",
      "Among the students who were placed, nothing measured explains who ended up earning more — so the analysis says exactly that, instead of fitting a story the data won't support",
    ],
  },
  {
    id: 7,
    title: "Madden 99",
    description:
      "An NFL roster-building game where two wheels decide your fate and you decide the roster. Spin a season from 2001–2025 and a division, then draft seven players — 1 QB, 2 HBs, 3 WRs and a TE — chasing the highest team overall you can get. Built on real Madden ratings for every season, with three modes: Classic, Extreme (ratings hidden while you draft) and Hard (one team, one season, no division to fall back on). It runs inside this portfolio — open the Fun Zone, or hit Live Demo below.",
    tech: ["TypeScript", "Next.js", "React", "Tailwind", "Python", "Claude Code"],
    github: "https://github.com/NotABot122/madden-99-game",
    demo: "/madden/",
    status: "Complete",
    icon: "🏈",
    highlights: [
      "25 seasons of real Madden ratings, tidied up once when the site is built so the game itself loads instantly",
      "Three difficulty modes run on one draft engine — what changes between them is how much you're allowed to see",
      "Built into this portfolio rather than hosted somewhere separate, so the whole thing ships as one site",
      "The draft holds you to the right mix of positions, with one respin per round",
    ],
  },
  {
    id: 8,
    title: "Beale Cipher Cryptanalysis",
    description:
      "A computational attack on the Beale Ciphers, a famously unsolved puzzle from the 1800s. They are three coded messages in which each number points to a word in some agreed book, and only one has ever been cracked — its key was the Declaration of Independence. The other two have held out for 140 years. This project hunts for the missing books at scale: it tries each candidate document as the key, starting from every possible point in it, scores how much like real English the result reads, and studies the counting mistakes in the one solved message to narrow down what the remaining keys can look like.",
    tech: ["Python", "NumPy", "Statistics", "Cryptanalysis", "Claude Code"],
    status: "In Progress",
    icon: "🔐",
    highlights: [
      "Tries 1.7 million different starting points across a pool of 40 candidate documents, all at once rather than one after another",
      "A language model rates how much each decoded attempt reads like English, judging it on its best stretch so a partly-correct key still stands out",
      "The one solved message contains known counting errors; measuring that same drift against each candidate book gives a second, independent way to rank them",
      "Every run writes out a single self-contained web page with the evidence and the rankings",
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
                <span>
                  {project.title}
                  {project.featured && (
                    <span title="Featured project" style={{ color: "#808000", marginLeft: 6 }}>★</span>
                  )}
                </span>
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
              <div style={{ fontSize: 20, fontFamily: "'VT323', monospace", color: "#000080" }}>
                {selected.title}
                {selected.featured && (
                  <span title="Featured project" style={{ color: "#808000", marginLeft: 8 }}>★</span>
                )}
              </div>
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
