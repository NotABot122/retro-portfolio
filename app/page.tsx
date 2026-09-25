"use client";
import { useState } from "react";
import BootScreen from "./components/BootScreen";
import Taskbar from "./components/Taskbar";
import Window from "./components/Window";
import AboutWindow from "./components/AboutWindow";
import ProjectsWindow from "./components/ProjectsWindow";
import FunWindow from "./components/FunWindow";
import PlayerGradesWindow from "./components/PlayerGradesWindow";

type WindowId = "about" | "projects" | "fun" | "grades";

interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  open: boolean;
}

const WINDOW_CONFIGS: Record<WindowId, { title: string; icon: string; defaultPos: { x: number; y: number }; defaultSize: { w: number; h: number } }> = {
  about: { title: "About Me", icon: "👤", defaultPos: { x: 60, y: 40 }, defaultSize: { w: 560, h: 480 } },
  projects: { title: "My Projects", icon: "💾", defaultPos: { x: 100, y: 60 }, defaultSize: { w: 620, h: 460 } },
  fun: { title: "Fun Zone", icon: "🎮", defaultPos: { x: 140, y: 50 }, defaultSize: { w: 560, h: 500 } },
  grades: { title: "NFL Player Grades", icon: "🧠", defaultPos: { x: 170, y: 70 }, defaultSize: { w: 680, h: 520 } },
};

const DESKTOP_ICONS: { id: WindowId; icon: string; label: string }[] = [
  { id: "about", icon: "👤", label: "About Me" },
  { id: "projects", icon: "💾", label: "Projects" },
  { id: "fun", icon: "🎮", label: "Fun Zone" },
];

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<Record<WindowId, boolean>>({ about: false, projects: false, fun: false, grades: false });
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);

  const openWindow = (id: WindowId) => {
    setWindows(w => ({ ...w, [id]: true }));
    setActiveWindow(id);
  };

  const closeWindow = (id: WindowId) => {
    setWindows(w => ({ ...w, [id]: false }));
    if (activeWindow === id) setActiveWindow(null);
  };

  const focusWindow = (id: WindowId) => setActiveWindow(id);

  const handleTaskbarWindowClick = (id: string) => {
    const wid = id as WindowId;
    if (activeWindow === wid) {
      // Just keep it focused
      setActiveWindow(wid);
    } else {
      openWindow(wid);
    }
  };

  const handleStartMenu = (item: string) => {
    if (item === "About Me") openWindow("about");
    else if (item === "Projects") openWindow("projects");
    else if (item === "Fun Zone") openWindow("fun");
    else if (item === "Shut Down") setBooted(false);
  };

  if (!booted) return <BootScreen onBoot={() => setBooted(true)} />;

  const openWindowList = Object.entries(windows)
    .filter(([, open]) => open)
    .map(([id]) => ({ id, title: WINDOW_CONFIGS[id as WindowId].title, icon: WINDOW_CONFIGS[id as WindowId].icon }));

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Desktop background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#008080",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(0,100,100,0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(0,60,80,0.2) 0%, transparent 50%)
        `,
      }} />

      {/* Desktop title */}
      <div style={{
        position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
        fontFamily: "'VT323', monospace", fontSize: 13, color: "rgba(255,255,255,0.25)",
        letterSpacing: 4, pointerEvents: "none", userSelect: "none",
      }}>
        PORTFOLIO 95 DESKTOP
      </div>

      {/* Desktop icons */}
      <div style={{ position: "absolute", top: 20, left: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {DESKTOP_ICONS.map(icon => (
          <div
            key={icon.id}
            className="desktop-icon"
            tabIndex={0}
            onDoubleClick={() => openWindow(icon.id)}
            onKeyDown={e => e.key === "Enter" && openWindow(icon.id)}
          >
            <div style={{
              width: 48, height: 48, fontSize: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.8))",
            }}>
              {icon.icon}
            </div>
            <div className="icon-label">{icon.label}</div>
          </div>
        ))}

        {/* Recycle bin */}
        <div className="desktop-icon" tabIndex={0}>
          <div style={{ width: 48, height: 48, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.8))" }}>
            🗑️
          </div>
          <div className="icon-label">Recycle Bin</div>
        </div>
      </div>

      {/* My Computer icon */}
      <div style={{ position: "absolute", top: 20, right: 16 }}>
        <div className="desktop-icon" tabIndex={0}>
          <div style={{ width: 48, height: 48, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.8))" }}>
            🖥️
          </div>
          <div className="icon-label">My Computer</div>
        </div>
      </div>

      {/* Welcome note on desktop */}
      {!Object.values(windows).some(Boolean) && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0,0,0,0.4)", padding: "12px 20px",
          fontFamily: "'VT323', monospace", color: "rgba(255,255,255,0.5)",
          fontSize: 14, textAlign: "center", pointerEvents: "none",
          letterSpacing: 2, lineHeight: 2,
        }}>
          Double-click an icon to open a window<br />
          or use the Start menu ↓
        </div>
      )}

      {/* Windows */}
      {windows.about && (
        <Window
          id="about"
          title={WINDOW_CONFIGS.about.title}
          icon={WINDOW_CONFIGS.about.icon}
          onClose={() => closeWindow("about")}
          onFocus={() => focusWindow("about")}
          isActive={activeWindow === "about"}
          defaultPosition={WINDOW_CONFIGS.about.defaultPos}
          defaultSize={WINDOW_CONFIGS.about.defaultSize}
        >
          <AboutWindow />
        </Window>
      )}

      {windows.projects && (
        <Window
          id="projects"
          title={WINDOW_CONFIGS.projects.title}
          icon={WINDOW_CONFIGS.projects.icon}
          onClose={() => closeWindow("projects")}
          onFocus={() => focusWindow("projects")}
          isActive={activeWindow === "projects"}
          defaultPosition={WINDOW_CONFIGS.projects.defaultPos}
          defaultSize={WINDOW_CONFIGS.projects.defaultSize}
        >
          <ProjectsWindow onOpenGrades={() => openWindow("grades")} />
        </Window>
      )}

      {windows.grades && (
        <Window
          id="grades"
          title={WINDOW_CONFIGS.grades.title}
          icon={WINDOW_CONFIGS.grades.icon}
          onClose={() => closeWindow("grades")}
          onFocus={() => focusWindow("grades")}
          isActive={activeWindow === "grades"}
          defaultPosition={WINDOW_CONFIGS.grades.defaultPos}
          defaultSize={WINDOW_CONFIGS.grades.defaultSize}
          minWidth={520}
          minHeight={360}
        >
          <PlayerGradesWindow />
        </Window>
      )}

      {windows.fun && (
        <Window
          id="fun"
          title={WINDOW_CONFIGS.fun.title}
          icon={WINDOW_CONFIGS.fun.icon}
          onClose={() => closeWindow("fun")}
          onFocus={() => focusWindow("fun")}
          isActive={activeWindow === "fun"}
          defaultPosition={WINDOW_CONFIGS.fun.defaultPos}
          defaultSize={WINDOW_CONFIGS.fun.defaultSize}
          minWidth={480}
          minHeight={380}
        >
          <FunWindow />
        </Window>
      )}

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindowList}
        activeWindow={activeWindow}
        onWindowClick={handleTaskbarWindowClick}
        onStartMenu={handleStartMenu}
      />
    </div>
  );
}
