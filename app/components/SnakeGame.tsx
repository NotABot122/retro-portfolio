"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const CELL = 16;
const COLS = 20;
const ROWS = 18;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function rand(): Point {
  return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 9 }, { x: 9, y: 9 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 9 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const dirRef = useRef<Dir>("RIGHT");
  const foodRef = useRef<Point>({ x: 15, y: 9 });
  const snakeRef = useRef<Point[]>([{ x: 10, y: 9 }, { x: 9, y: 9 }]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reset = () => {
    const s = [{ x: 10, y: 9 }, { x: 9, y: 9 }];
    const f = { x: 15, y: 9 };
    snakeRef.current = s;
    foodRef.current = f;
    setSnake(s);
    setFood(f);
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setDead(false);
    setScore(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running || dead) return;
    const interval = setInterval(() => {
      const d = dirRef.current;
      const prev = snakeRef.current;
      const head = prev[0];
      const next: Point = {
        x: (head.x + (d === "RIGHT" ? 1 : d === "LEFT" ? -1 : 0) + COLS) % COLS,
        y: (head.y + (d === "DOWN" ? 1 : d === "UP" ? -1 : 0) + ROWS) % ROWS,
      };
      if (prev.some(s => s.x === next.x && s.y === next.y)) {
        setDead(true);
        setRunning(false);
        return;
      }
      const ateFood = foodRef.current.x === next.x && foodRef.current.y === next.y;
      const newSnake = ateFood ? [next, ...prev] : [next, ...prev.slice(0, -1)];
      snakeRef.current = newSnake;
      if (ateFood) {
        setScore(sc => { const ns = sc + 10; setHiScore(h => Math.max(h, ns)); return ns; });
        let nf = rand();
        while (newSnake.some(s => s.x === nf.x && s.y === nf.y)) nf = rand();
        foodRef.current = nf;
        setFood(nf);
      }
      setSnake(newSnake);
    }, 130);
    return () => clearInterval(interval);
  }, [running, dead]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    // Grid
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
      ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
    }
    // Food
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    // Snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#00ff00" : "#008800";
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [snake, food]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (d !== opp[dirRef.current]) {
        dirRef.current = d;
        setDir(d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "'Share Tech Mono', monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: COLS * CELL, padding: "4px 0", fontSize: 12 }}>
        <span>SCORE: {score}</span>
        <span>HI: {hiScore}</span>
      </div>

      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
          style={{ border: "2px solid #808080", display: "block" }} />
        {(!running && !dead) && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12
          }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 28, color: "#00ff00", letterSpacing: 3 }}>SNAKE</div>
            <div style={{ fontSize: 11, color: "#888" }}>Arrow keys / WASD to move</div>
            <button className="win95-button" onClick={reset} style={{ marginTop: 8 }}>▶ Start Game</button>
          </div>
        )}
        {dead && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12
          }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 28, color: "#ff0000" }}>GAME OVER</div>
            <div style={{ fontSize: 12, color: "#fff" }}>Score: {score}</div>
            <button className="win95-button" onClick={reset}>↺ Play Again</button>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 36px)", gridTemplateRows: "repeat(2, 36px)", gap: 2, marginTop: 4 }}>
        {[
          { label: "▲", dir: "UP" as Dir, col: 2, row: 1 },
          { label: "◀", dir: "LEFT" as Dir, col: 1, row: 2 },
          { label: "▼", dir: "DOWN" as Dir, col: 2, row: 2 },
          { label: "▶", dir: "RIGHT" as Dir, col: 3, row: 2 },
        ].map(btn => (
          <button
            key={btn.label}
            className="win95-button"
            style={{ gridColumn: btn.col, gridRow: btn.row, padding: 0, fontSize: 14, width: 36, height: 36 }}
            onMouseDown={() => {
              const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
              if (btn.dir !== opp[dirRef.current]) {
                dirRef.current = btn.dir;
                setDir(btn.dir);
              }
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
