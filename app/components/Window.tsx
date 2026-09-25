"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

const BEZEL = { top: 52, side: 56, bottom: 56, taskbar: 36 } as const;

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  onClose: () => void;
  onFocus: () => void;
  isActive: boolean;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { w: number; h: number };
  minWidth?: number;
  minHeight?: number;
}

export default function Window({
  title, icon, children, onClose, onFocus, isActive,
  defaultPosition = { x: 80, y: 60 },
  defaultSize = { w: 600, h: 420 },
  minWidth = 320, minHeight = 200,
}: WindowProps) {
  const [pos, setPos] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [prevState, setPrevState] = useState({ pos: defaultPosition, size: defaultSize });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    onFocus();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: size.w, origH: size.h };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setPos({
          x: Math.max(BEZEL.side, dragRef.current.origX + dx),
          y: Math.max(BEZEL.top, Math.min(window.innerHeight - BEZEL.bottom - BEZEL.taskbar - 24, dragRef.current.origY + dy)),
        });
      }
      if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        setSize({
          w: Math.max(minWidth, resizeRef.current.origW + dx),
          h: Math.max(minHeight, resizeRef.current.origH + dy),
        });
      }
    };
    const onUp = () => { dragRef.current = null; resizeRef.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [minWidth, minHeight]);

  const toggleMaximize = () => {
    if (maximized) {
      setPos(prevState.pos);
      setSize(prevState.size);
      setMaximized(false);
    } else {
      setPrevState({ pos, size });
      setPos({ x: BEZEL.side, y: BEZEL.top });
      setSize({ w: window.innerWidth - BEZEL.side * 2, h: window.innerHeight - BEZEL.top - BEZEL.bottom - BEZEL.taskbar });
      setMaximized(true);
    }
    onFocus();
  };

  if (minimized) return null;

  const style = maximized
    ? { position: "fixed" as const, top: BEZEL.top, left: BEZEL.side, width: `calc(100vw - ${BEZEL.side * 2}px)`, height: `calc(100vh - ${BEZEL.top + BEZEL.bottom + BEZEL.taskbar}px)`, zIndex: isActive ? 500 : 400 }
    : { position: "fixed" as const, top: pos.y, left: pos.x, width: size.w, height: size.h, zIndex: isActive ? 500 : 400 };

  return (
    <div
      ref={windowRef}
      className="win95-window animate-slidein"
      style={style}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="win95-titlebar"
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={toggleMaximize}
        style={{ opacity: isActive ? 1 : 0.7 }}
      >
        <div className="win95-titlebar-text">
          <span style={{ fontSize: 14 }}>{icon}</span>
          {title}
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          <button className="win95-btn" onClick={(e) => { e.stopPropagation(); setMinimized(true); }} title="Minimize">_</button>
          <button className="win95-btn" onClick={(e) => { e.stopPropagation(); toggleMaximize(); }} title="Maximize">□</button>
          <button className="win95-btn" onClick={(e) => { e.stopPropagation(); onClose(); }} title="Close" style={{ fontWeight: "bold" }}>✕</button>
        </div>
      </div>

      {/* Menu bar placeholder */}
      <div style={{ background: "var(--win95-gray)", padding: "2px 4px", fontSize: 12, borderBottom: "1px solid #808080", display: "flex", gap: 8 }}>
        <span style={{ padding: "1px 6px", cursor: "pointer" }} className="menu-item">File</span>
        <span style={{ padding: "1px 6px", cursor: "pointer" }} className="menu-item">View</span>
        <span style={{ padding: "1px 6px", cursor: "pointer" }} className="menu-item">Help</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", height: "calc(100% - 52px)", background: "var(--win95-gray)", padding: 4 }}>
        <div className="win95-content" style={{ height: "100%", padding: 12, overflowY: "auto" }}>
          {children}
        </div>
      </div>

      {/* Resize handle */}
      {!maximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute", bottom: 0, right: 0,
            width: 16, height: 16,
            cursor: "se-resize",
            background: "var(--win95-gray)",
            borderTop: "1px solid #808080",
            borderLeft: "1px solid #808080",
          }}
        >
          <div style={{ fontSize: 10, lineHeight: 1, color: "#808080", padding: "2px 1px" }}>◢</div>
        </div>
      )}
    </div>
  );
}
