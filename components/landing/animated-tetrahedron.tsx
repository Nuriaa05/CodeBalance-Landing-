"use client";

import { useEffect, useRef } from "react";

const POINT_CHARS = ".:-=+*#%@";
type Point3D = { x: number; y: number; z: number };
type RotationState = { x: number; y: number };
type DragState = RotationState & {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  pointerId: number | null;
  velocityX: number;
  velocityY: number;
};

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

const rotatePoint = (point: Point3D, time: number, manualRotation: RotationState) =>
  rotateZ(
    rotateX(
      rotateY(point, time * 0.4 + manualRotation.y),
      time * 0.3 + manualRotation.x,
    ),
    time * 0.2,
  );

export function AnimatedTetrahedron() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const dragRef = useRef<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    pointerId: null,
    velocityX: 0,
    velocityY: 0,
    x: 0,
    y: 0,
  });

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
    const dragSensitivity = 0.008;
    const dragFriction = 0.92;

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

    const applyDragMomentum = () => {
      const drag = dragRef.current;

      if (drag.isDragging) return;

      drag.x += drag.velocityX;
      drag.y += drag.velocityY;
      drag.velocityX *= dragFriction;
      drag.velocityY *= dragFriction;

      if (Math.abs(drag.velocityX) < 0.0001) drag.velocityX = 0;
      if (Math.abs(drag.velocityY) < 0.0001) drag.velocityY = 0;
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const safeSize = Math.min(rect.width, rect.height);
      const scale = safeSize * 0.42;
      const points: { x: number; y: number; z: number; char: string }[] = [];

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = "18px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      applyDragMomentum();

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
              dragRef.current,
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
                dragRef.current,
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

    const renderStaticFrame = () => {
      if (prefersReducedMotion) render();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const drag = dragRef.current;
      drag.isDragging = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.pointerId = event.pointerId;
      drag.velocityX = 0;
      drag.velocityY = 0;

      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
      event.preventDefault();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;

      if (!drag.isDragging || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.lastX;
      const deltaY = event.clientY - drag.lastY;
      const rotationX = deltaY * dragSensitivity;
      const rotationY = deltaX * dragSensitivity;

      drag.x += rotationX;
      drag.y += rotationY;
      drag.velocityX = rotationX;
      drag.velocityY = rotationY;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;

      renderStaticFrame();
      event.preventDefault();
    };

    const handlePointerEnd = (event: PointerEvent) => {
      const drag = dragRef.current;

      if (drag.pointerId !== event.pointerId) return;

      drag.isDragging = false;
      drag.pointerId = null;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      canvas.style.cursor = "grab";
      renderStaticFrame();
    };

    resize();
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerEnd);
    canvas.addEventListener("pointercancel", handlePointerEnd);
    canvas.addEventListener("lostpointercapture", handlePointerEnd);
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerEnd);
      canvas.removeEventListener("pointercancel", handlePointerEnd);
      canvas.removeEventListener("lostpointercapture", handlePointerEnd);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
      style={{ cursor: "grab", display: "block", touchAction: "none" }}
    />
  );
}
