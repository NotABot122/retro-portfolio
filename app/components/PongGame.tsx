"use client";
import { useEffect, useRef, useState } from "react";

const W = 400, H = 280, PADDLE_H = 60, PADDLE_W = 10, BALL_SIZE = 10, SPEED = 4;

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ball: { x: W / 2, y: H / 2, vx: SPEED, vy: SPEED * 0.8 },
    p1: { y: H / 2 - PADDLE_H / 2 },
    p2: { y: H / 2 - PADDLE_H / 2 },
    score: { p1: 0, p2: 0 },
    running: false,
    keys: { w: false, s: false, up: false, down: false },
  });
  const animRef = useRef<number>(0);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);

  const resetBall = (dir = 1) => {
    const s = stateRef.current;
    s.ball = { x: W / 2, y: H / 2, vx: SPEED * dir, vy: (Math.random() * 2 - 1) * SPEED };
  };

  const start = () => {
    stateRef.current.score = { p1: 0, p2: 0 };
    stateRef.current.p1.y = H / 2 - PADDLE_H / 2;
    stateRef.current.p2.y = H / 2 - PADDLE_H / 2;
    resetBall();
    stateRef.current.running = true;
    setScore({ p1: 0, p2: 0 });
    setStarted(true);
    setPaused(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = stateRef.current.keys;
      if (e.key === "w" || e.key === "W") k.w = down;
      if (e.key === "s" || e.key === "S") k.s = down;
      if (e.key === "ArrowUp") { k.up = down; e.preventDefault(); }
      if (e.key === "ArrowDown") { k.down = down; e.preventDefault(); }
    };
    const down = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const s = stateRef.current;
      if (s.running && !paused) {
        // Move paddles
        const spd = 5;
        if (s.keys.w) s.p1.y = Math.max(0, s.p1.y - spd);
        if (s.keys.s) s.p1.y = Math.min(H - PADDLE_H, s.p1.y + spd);
        if (s.keys.up) s.p2.y = Math.max(0, s.p2.y - spd);
        if (s.keys.down) s.p2.y = Math.min(H - PADDLE_H, s.p2.y + spd);

        // Move ball
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;

        // Wall bounce
        if (s.ball.y <= 0 || s.ball.y >= H - BALL_SIZE) s.ball.vy *= -1;

        // Paddle collision P1
        if (s.ball.x <= PADDLE_W + 8 && s.ball.x >= PADDLE_W &&
          s.ball.y + BALL_SIZE >= s.p1.y && s.ball.y <= s.p1.y + PADDLE_H) {
          s.ball.vx = Math.abs(s.ball.vx) * 1.04;
          const rel = (s.ball.y + BALL_SIZE / 2 - (s.p1.y + PADDLE_H / 2)) / (PADDLE_H / 2);
          s.ball.vy = rel * SPEED * 1.2;
        }

        // Paddle collision P2
        if (s.ball.x >= W - PADDLE_W - BALL_SIZE - 8 && s.ball.x <= W - PADDLE_W &&
          s.ball.y + BALL_SIZE >= s.p2.y && s.ball.y <= s.p2.y + PADDLE_H) {
          s.ball.vx = -Math.abs(s.ball.vx) * 1.04;
          const rel = (s.ball.y + BALL_SIZE / 2 - (s.p2.y + PADDLE_H / 2)) / (PADDLE_H / 2);
          s.ball.vy = rel * SPEED * 1.2;
        }

        // Cap speed
        const maxSpd = SPEED * 2.5;
        if (Math.abs(s.ball.vx) > maxSpd) s.ball.vx = maxSpd * Math.sign(s.ball.vx);
        if (Math.abs(s.ball.vy) > maxSpd) s.ball.vy = maxSpd * Math.sign(s.ball.vy);

        // Score
        if (s.ball.x < 0) { s.score.p2++; setScore({ ...s.score }); resetBall(1); }
        if (s.ball.x > W) { s.score.p1++; setScore({ ...s.score }); resetBall(-1); }
      }

      // Draw
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      // Center line
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "#333";
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);
      // Paddles
      ctx.fillStyle = "#fff";
      ctx.fillRect(PADDLE_W, s.p1.y, PADDLE_W, PADDLE_H);
      ctx.fillRect(W - PADDLE_W * 2, s.p2.y, PADDLE_W, PADDLE_H);
      // Ball
      ctx.fillStyle = "#fff";
      ctx.fillRect(s.ball.x, s.ball.y, BALL_SIZE, BALL_SIZE);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [paused]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Scoreboard */}
      <div style={{ display: "flex", justifyContent: "space-between", width: W, padding: "4px 0", fontSize: 12 }}>
        <span>P1 (W/S): {score.p1}</span>
        <span style={{ color: "#666" }}>— PONG —</span>
        <span>P2 (↑↓): {score.p2}</span>
      </div>

      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={W} height={H} style={{ border: "2px solid #808080", display: "block" }} />

        {!started && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 36, color: "#fff", letterSpacing: 6 }}>PONG</div>
            <div style={{ fontSize: 11, color: "#888", textAlign: "center", lineHeight: 2 }}>
              Player 1: W / S keys<br />Player 2: ↑ / ↓ keys
            </div>
            <button className="win95-button" onClick={start} style={{ marginTop: 8 }}>▶ Start Game</button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="win95-button" onClick={start} style={{ fontSize: 12, padding: "3px 10px" }}>↺ Restart</button>
        <button className="win95-button"
          style={{ fontSize: 12, padding: "3px 10px" }}
          onClick={() => { stateRef.current.running = !paused; setPaused(!paused); }}>
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}
