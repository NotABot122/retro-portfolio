"use client";
import { useState, useEffect } from "react";

interface TaskbarProps {
  openWindows: { id: string; title: string; icon: string }[];
  activeWindow: string | null;
  onWindowClick: (id: string) => void;
  onStartMenu: (item: string) => void;
}

export default function Taskbar({ openWindows, activeWindow, onWindowClick, onStartMenu }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      setTime(`${h % 12 || 12}:${m} ${ampm}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const menuItems = [
    { icon: "👤", label: "About Me" },
    { icon: "💾", label: "Projects" },
    { icon: "🎮", label: "Fun Zone" },
    { icon: "─", label: "", divider: true },
    { icon: "🔌", label: "Shut Down" },
  ];

  return (
    <>
      {startOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={() => setStartOpen(false)} />
          <div className="start-menu animate-fadein">
            <div className="start-menu-stripe">Windows 95</div>
            <div className="start-menu-items">
              {menuItems.map((item, i) =>
                item.divider ? (
                  <hr key={i} className="win95-divider" style={{ margin: "4px 8px" }} />
                ) : (
                  <div
                    key={i}
                    className="start-menu-item"
                    onClick={() => {
                      setStartOpen(false);
                      onStartMenu(item.label);
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}

      <div className="taskbar">
        <button className={`start-button ${startOpen ? "open" : ""}`} onClick={() => setStartOpen(!startOpen)}>
          <span style={{ fontSize: 16 }}>🪟</span>
          <strong>Start</strong>
        </button>

        <div style={{ width: 2, height: 28, borderLeft: "1px solid #808080", borderRight: "1px solid #fff", margin: "0 2px" }} />

        {openWindows.map((w) => (
          <button
            key={w.id}
            className={`taskbar-window-btn ${activeWindow === w.id ? "active" : ""}`}
            onClick={() => onWindowClick(w.id)}
          >
            <span style={{ fontSize: 14 }}>{w.icon}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{w.title}</span>
          </button>
        ))}

        <div className="taskbar-clock">{time}</div>
      </div>
    </>
  );
}
