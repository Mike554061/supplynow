"use client";
import { useEffect, useRef } from "react";

// The hero graphic from supplynow.org (hero-network.mp4). It tries a local copy in /public first,
// then the live supplynow.org file, and falls back to the animated night-highway canvas from the
// original landing page if neither loads or the visitor prefers reduced motion.
const SOURCES = [
  process.env.NEXT_PUBLIC_HERO_VIDEO,
  "/hero-network.mp4",
  "https://www.supplynow.org/hero-network.mp4",
].filter(Boolean) as string[];

export function HeroMedia() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const cv = cvRef.current, vid = vidRef.current;
    const hero = cv?.closest(".hero") as HTMLElement | null;
    if (!cv || !hero) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let stopped = false, visible = true, raf = 0, last = 0, time = 0;

    if (vid && !reduce) {
      let i = 0;
      const tryNext = () => {
        if (i >= SOURCES.length) { vid.remove(); return; }
        vid.src = SOURCES[i++];
      };
      vid.addEventListener("error", tryNext);
      vid.addEventListener("canplay", () => {
        vid.classList.add("on");
        vid.play().catch(() => {});
        stopped = true;
      }, { once: true });
      tryNext();
    }

    let seed = 11;
    const R = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const skyline = Array.from({ length: 46 }, () => ({ x: R(), w: 0.004 + R() * 0.014, h: 3 + R() * R() * 52, lit: R() }));
    let W = 0, H = 0, vx = 0, vy = 0, RW = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = W < 700;
      vx = narrow ? W * 0.5 : W * 0.68; vy = narrow ? Math.min(H * 0.24, 260) : H * 0.4;
      RW = W * (narrow ? 2.6 : 2.3);
    };
    const P = (f: number, t: number) => { const bx = vx + (f - 0.5) * RW; return [vx + (bx - vx) * t, vy + (H - vy) * t]; };
    const seg = (f: number, t1: number, t2: number) => { const a = P(f, t1), b = P(f, t2); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
    const ON = [1 / 12, 3 / 12, 5 / 12], AWAY = [7 / 12, 9 / 12, 11 / 12];
    type Car = { on: boolean; f: number; z: number; v: number };
    const spawn = (c: Car, first: boolean) => {
      if (c.on) { c.f = ON[(R() * 3) | 0]; c.z = first ? 1 + R() * 40 : 30 + R() * 15; c.v = -(9 + R() * 7); }
      else { c.f = AWAY[(R() * 3) | 0]; c.z = first ? 0.8 + R() * 30 : 0.7; c.v = 2 + R() * 4; }
      c.f += (R() - 0.5) * 0.03;
    };
    const cars: Car[] = [];
    for (let i = 0; i < 26; i++) { const c = { on: i < 13, f: 0, z: 0, v: 0 }; spawn(c, true); cars.push(c); }
    const reefer: Car = { on: false, f: 7 / 12, z: 2.2, v: 1.3 };
    const light = (f: number, z1: number, z2: number, rgb: string, w: number) => {
      if (z1 < 0.55) z1 = 0.55; if (z2 <= z1) return;
      const t = 1 / z1, a = Math.min(1, 0.45 + t * 3);
      ctx.lineWidth = Math.max(3, w * t * 3.6); ctx.strokeStyle = `rgba(${rgb},${a * 0.28})`; seg(f, 1 / z1, 1 / z2);
      ctx.lineWidth = Math.max(1.2, w * t); ctx.strokeStyle = `rgba(${rgb},${a})`; seg(f, 1 / z1, 1 / z2);
    };
    const draw = () => {
      const g = ctx.createLinearGradient(0, 0, 0, vy);
      g.addColorStop(0, "#060d13"); g.addColorStop(1, "#16303e");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, vy + 1);
      ctx.fillStyle = "#060c11"; ctx.fillRect(0, vy, W, H - vy);
      const glow = ctx.createRadialGradient(vx, vy, 0, vx, vy, W * 0.45);
      glow.addColorStop(0, "rgba(233,200,100,.28)"); glow.addColorStop(1, "rgba(233,200,100,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      const span = Math.min(W * 0.5, 520), x0 = vx - span * 0.55;
      skyline.forEach((b) => {
        const x = x0 + b.x * span, w = Math.max(3, b.w * span), h = b.h * (span / 520);
        ctx.fillStyle = "#0a161e"; ctx.fillRect(x, vy - h, w, h);
        if (b.lit > 0.55 && h > 12) { ctx.fillStyle = "rgba(233,200,100,.55)"; ctx.fillRect(x + w * 0.35, vy - h * 0.7, 1.2, 1.2); }
      });
      const bl = P(-0.02, 1.3), br = P(1.02, 1.3);
      ctx.fillStyle = "rgba(255,255,255,.03)";
      ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(bl[0], bl[1]); ctx.lineTo(br[0], br[1]); ctx.closePath(); ctx.fill();
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1.5; seg(0, 0.01, 1.3); seg(1, 0.01, 1.3);
      ctx.strokeStyle = "rgba(233,200,100,.4)"; seg(0.493, 0.01, 1.3); seg(0.507, 0.01, 1.3);
      const period = 3.2, len = 1.2, phase = (time * 7) % period;
      [1 / 6, 2 / 6, 4 / 6, 5 / 6].forEach((f) => {
        for (let k = 0; k < 16; k++) {
          const z = 0.6 + k * period - phase; if (z < 0.6) continue;
          const t = 1 / z; ctx.lineWidth = Math.max(0.6, 3.5 * t);
          ctx.strokeStyle = `rgba(255,255,255,${0.4 * Math.min(1, t * 4)})`;
          seg(f, t, 1 / (z + len));
        }
      });
      ctx.globalCompositeOperation = "lighter";
      cars.concat([reefer]).forEach((c) => {
        if (c.on) { light(c.f - 0.028, c.z, c.z + 2.4, "255,240,215", 3); light(c.f + 0.028, c.z, c.z + 2.4, "255,240,215", 3); }
        else { const rgb = "255,60,50"; light(c.f - 0.03, c.z - 1.4, c.z, rgb, 2.6); light(c.f + 0.03, c.z - 1.4, c.z, rgb, 2.6); }
      });
      ctx.globalCompositeOperation = "source-over";
      const t = 1 / reefer.z;
      if (W >= 700 && t > 0.08 && t < 0.75) {
        const p = P(reefer.f, t), y = p[1] - 26 * t - 6, pulse = (time % 1.6) / 1.6;
        ctx.strokeStyle = `rgba(0,180,166,${1 - pulse})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p[0], y, 5 + pulse * 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#00b4a6"; ctx.beginPath(); ctx.arc(p[0], y, 4, 0, Math.PI * 2); ctx.fill();
        const label = "OUR TRUCK  34°F  LIVE GPS";
        ctx.font = "700 11px 'Source Sans 3', Arial, sans-serif";
        const tw = ctx.measureText(label).width, lx = p[0] - (tw + 16) / 2, ly = y + 16;
        ctx.fillStyle = "rgba(6,13,19,.82)"; ctx.strokeStyle = "rgba(0,180,166,.8)"; ctx.lineWidth = 1;
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(lx, ly, tw + 16, 20, 10); else ctx.rect(lx, ly, tw + 16, 20); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#bff3ee"; ctx.fillText(label, lx + 8, ly + 14);
      }
    };
    const step = (dt: number) => {
      time += dt;
      cars.forEach((c) => { c.z += c.v * dt; if (c.on ? c.z < 0.55 : c.z > 45) spawn(c, false); });
      reefer.z += reefer.v * dt; if (reefer.z > 14) reefer.z = 1.6;
    };
    const frame = (ts: number) => {
      raf = 0;
      if (stopped || !visible || document.hidden) return;
      const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0.016; last = ts;
      step(dt); draw(); raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && !reduce && !stopped) { last = 0; raf = requestAnimationFrame(frame); } };
    const onResize = () => { size(); draw(); };
    size(); step(0); draw();
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) kick(); });
    io.observe(hero);
    document.addEventListener("visibilitychange", kick);
    document.fonts?.ready.then(draw);
    kick();
    return () => {
      stopped = true; if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", kick); io.disconnect();
    };
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      <canvas ref={cvRef} />
      <video ref={vidRef} muted loop playsInline autoPlay preload="auto" />
    </div>
  );
}
