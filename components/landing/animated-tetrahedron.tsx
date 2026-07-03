"use client";

import { useEffect, useRef } from "react";

const POINT_CHARS = ".:-=+*#%@";
type Point3D = { x: number; y: number; z: number };

const vertices: Point3D[] = [
  { x: 0, y: 1, z: 0 },
  { x: -0.943, y: -0.333, z: -0.5 },
  { x: 0.943, y: -0.333, z: -0.5 },
  { x: 0, y: -0.333, z: 1 },
];

const edges = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [2, 3],
  [3, 1],
];

const faces = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 1],
  [1, 3, 2],
];

const rotateY = (point: Point3D, angle: number): Point3D => ({
  x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
  y: point.y,
  z: point.x * Math.sin(angle) + point.z * Math.cos(angle),
});

const rotateX = (point: Point3D, angle: number): Point3D => ({
  x: point.x,
  y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
  z: point.y * Math.sin(angle) + point.z * Math.cos(angle),
});

const rotateZ = (point: Point3D, angle: number): Point3D => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
  z: point.z,
});

const rotatePoint = (point: Point3D, time: number) =>
  rotateZ(rotateX(rotateY(point, time * 0.4), time * 0.3), time * 0.2);

export function AnimatedTetrahedron() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inkColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--navy-main-rgb")
      .trim() || "18, 30, 82";
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pushPoint = (
      points: { x: number; y: number; z: number; char: string }[],
      point: Point3D,
      centerX: number,
      centerY: number,
      scale: number,
    ) => {
      const depth = (point.z + 1.5) / 3;
      const charIndex = Math.floor(depth * (POINT_CHARS.length - 1));

      points.push({
        x: centerX + point.x * scale,
        y: centerY - point.y * scale,
        z: point.z,
        char: POINT_CHARS[Math.min(charIndex, POINT_CHARS.length - 1)],
      });
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scale = Math.min(rect.width, rect.height) * 0.7;
      const points: { x: number; y: number; z: number; char: string }[] = [];

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = "18px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const [i, j] of edges) {
        const v1 = vertices[i];
        const v2 = vertices[j];

        for (let t = 0; t <= 1; t += 0.05) {
          pushPoint(
            points,
            rotatePoint(
              {
                x: v1.x + (v2.x - v1.x) * t,
                y: v1.y + (v2.y - v1.y) * t,
                z: v1.z + (v2.z - v1.z) * t,
              },
              time,
            ),
            centerX,
            centerY,
            scale,
          );
        }
      }

      for (const [i, j, k] of faces) {
        const v1 = vertices[i];
        const v2 = vertices[j];
        const v3 = vertices[k];

        for (let u = 0; u <= 1; u += 0.12) {
          for (let v = 0; v <= 1 - u; v += 0.12) {
            const w = 1 - u - v;

            pushPoint(
              points,
              rotatePoint(
                {
                  x: v1.x * u + v2.x * v + v3.x * w,
                  y: v1.y * u + v2.y * v + v3.y * w,
                  z: v1.z * u + v2.z * v + v3.z * w,
                },
                time,
              ),
              centerX,
              centerY,
              scale,
            );
          }
        }
      }

      points.sort((a, b) => a.z - b.z);

      for (const point of points) {
        const alpha = Math.min(0.15 + (point.z + 1.5) * 0.25, 0.9);
        ctx.fillStyle = `rgba(${inkColor}, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      }

      time += 0.015;

      if (!prefersReducedMotion) {
        frameRef.current = requestAnimationFrame(render);
      }
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
      style={{ display: "block" }}
    />
  );
}
