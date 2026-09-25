"use client";
import { useState, useEffect } from "react";

interface BootScreenProps {
  onBoot: () => void;
}

export default function BootScreen({ onBoot }: BootScreenProps) {
  const [phase, setPhase] = useState<"bios" | "loading" | "press">("bios");
  const [biosLines, setBiosLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const biosText = [
    "Award Modular BIOS v4.51PG, An Energy Star Ally",
    "Copyright (C) 1984-96, Award Software, Inc.",
    "",
    "PORTFOLIO/OS Release 1.0  (C) 1995",
    "",
    "Checking RAM ... 16384K OK",
    "CPU: Intel Pentium 133MHz",
    "Initializing display adapter ... OK",
    "Loading PORTFOLIO.SYS ...",
    "Starting MS-Portfolio 95 ...",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < biosText.length) {
        setBiosLines((prev) => [...prev, biosText[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("loading"), 400);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setPhase("press"), 600);
      } else {
        setProgress(p);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="boot-screen animate-flicker" style={{ fontFamily: "'VT323', monospace" }}>
      {phase === "bios" && (
        <div style={{ maxWidth: 640, width: "100%", padding: "0 24px" }}>
          {biosLines.map((line, i) => (
            <div key={i} style={{ lineHeight: "1.6", fontSize: 17, color: (line ?? "").startsWith("Award") || (line ?? "").startsWith("Copyright") ? "#aaa" : "#ccc" }}>
              {line || "\u00A0"}
            </div>
          ))}
          <span className="animate-blink" style={{ color: "#ccc" }}>_</span>
        </div>
      )}

      {phase === "loading" && (
        <div style={{ maxWidth: 400, width: "100%", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "#fff", fontFamily: "'VT323', monospace", marginBottom: 12, letterSpacing: 4 }}>
            PORTFOLIO 95
          </div>
          <div style={{ fontSize: 16, color: "#888", marginBottom: 32 }}>
            Personal Edition
          </div>
          <div style={{ border: "2px solid #444", background: "#111", height: 24, marginBottom: 12, position: "relative", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(to right, #000080, #1084d0)",
                width: `${progress}%`,
                transition: "width 0.15s linear",
                position: "relative",
              }}
            />
          </div>
          <div style={{ fontSize: 14, color: "#555" }}>
            Loading personal files... {Math.round(progress)}%
          </div>
        </div>
      )}

      {phase === "press" && (
        <div style={{ textAlign: "center" }} className="animate-fadein">
          <div style={{ fontSize: 52, color: "#fff", fontFamily: "'VT323', monospace", letterSpacing: 5, marginBottom: 16 }}>
            PORTFOLIO 95
          </div>
          <div style={{ fontSize: 16, color: "#555", marginBottom: 48 }}>Personal Edition</div>
          <button
            className="press-start"
            onClick={onBoot}
            style={{
              background: "none",
              border: "2px solid #fff",
              color: "#fff",
              fontFamily: "'VT323', monospace",
              fontSize: 28,
              letterSpacing: 4,
              padding: "10px 32px",
              cursor: "pointer",
              animation: "blink 1.2s step-end infinite",
            }}
          >
            ► CLICK TO START
          </button>
          <div style={{ marginTop: 64, fontSize: 13, color: "#333" }}>
            © 1995 Portfolio Systems, Inc. All rights reserved.
          </div>
        </div>
      )}
    </div>
  );
}
