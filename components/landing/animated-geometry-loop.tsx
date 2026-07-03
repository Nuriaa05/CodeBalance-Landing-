"use client";

import { useEffect, useRef } from "react";

const POINT_CHARS = ".:-=+*#%@";
const SHAPE_DURATION_MS = 3000;
const SHAPE_RADIUS_RATIO = 0.525;

type ShapeName = "sphere" | "tetrahedron" | "cube" | "rhombus";
type PointWeight = "edge" | "face" | "surface";
type Point3D = { x: number; y: number; z: number };
type ModelPoint = Point3D & { weight: PointWeight };
type DrawPoint = Point3D & { alpha: number; char: string; weight: PointWeight };

const SHAPE_SEQUENCE: ShapeName[] = ["sphere", "tetrahedron", "cube", "rhombus"];
const CUBE_COORD = 1 / Math.sqrt(3);
const TETRA_COORD = 1 / Math.sqrt(3);

const tetrahedronVertices: Point3D[] = [
  { x: TETRA_COORD, y: TETRA_COORD, z: TETRA_COORD },
  { x: -TETRA_COORD, y: -TETRA_COORD, z: TETRA_COORD },
  { x: -TETRA_COORD, y: TETRA_COORD, z: -TETRA_COORD },
  { x: TETRA_COORD, y: -TETRA_COORD, z: -TETRA_COORD },
];

const cubeVertices: Point3D[] = [
  { x: -CUBE_COORD, y: -CUBE_COORD, z: -CUBE_COORD },
  { x: CUBE_COORD, y: -CUBE_COORD, z: -CUBE_COORD },
  { x: CUBE_COORD, y: CUBE_COORD, z: -CUBE_COORD },
  { x: -CUBE_COORD, y: CUBE_COORD, z: -CUBE_COORD },
  { x: -CUBE_COORD, y: -CUBE_COORD, z: CUBE_COORD },
  { x: CUBE_COORD, y: -CUBE_COORD, z: CUBE_COORD },
  { x: CUBE_COORD, y: CUBE_COORD, z: CUBE_COORD },
  { x: -CUBE_COORD, y: CUBE_COORD, z: CUBE_COORD },
];

const rhombusVertices: Point3D[] = [
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: -1 },
  { x: 0, y: 0, z: 1 },
];

const tetrahedronEdges = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

const cubeEdges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const rhombusEdges = [
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 4],
  [4, 3],
  [3, 5],
  [5, 2],
];

const tetrahedronFaces = [
  [0, 1, 2],
  [0, 3, 1],
  [0, 2, 3],
  [1, 3, 2],
];

const cubeFaces = [
  [0, 1, 2, 3],
  [4, 7, 6, 5],
  [0, 4, 5, 1],
  [3, 2, 6, 7],
  [0, 3, 7, 4],
  [1, 5, 6, 2],
];

const rhombusFaces = [
  [0, 2, 4],
  [0, 4, 3],
  [0, 3, 5],
  [0, 5, 2],
  [1, 4, 2],
  [1, 3, 4],
  [1, 5, 3],
  [1, 2, 5],
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const mixPoint = (from: Point3D, to: Point3D, amount: number): Point3D => ({
  x: from.x + (to.x - from.x) * amount,
  y: from.y + (to.y - from.y) * amount,
  z: from.z + (to.z - from.z) * amount,
});

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

const rotatePoint = (point: Point3D, time: number, shapeName: ShapeName): Point3D => {
  const offsets: Record<ShapeName, Point3D> = {
    sphere: { x: 0, y: 0, z: 0 },
    tetrahedron: { x: 0.15, y: 0.4, z: -0.12 },
    cube: { x: -0.25, y: 0.52, z: 0.1 },
    rhombus: { x: 0.32, y: -0.35, z: 0.24 },
  };
  const offset = offsets[shapeName];

  return rotateZ(
    rotateX(
      rotateY(point, time * 0.32 + offset.y),
      time * 0.22 + offset.x,
    ),
    time * 0.12 + offset.z,
  );
};

const addEdgePoints = (
  points: ModelPoint[],
  vertices: Point3D[],
  edges: number[][],
  step = 0.04,
) => {
  for (const [fromIndex, toIndex] of edges) {
    const from = vertices[fromIndex];
    const to = vertices[toIndex];

    for (let amount = 0; amount <= 1; amount += step) {
      points.push({ ...mixPoint(from, to, amount), weight: "edge" });
    }
  }
};

const addTriangleFacePoints = (
  points: ModelPoint[],
  vertices: Point3D[],
  faces: number[][],
  step = 0.2,
) => {
  for (const [aIndex, bIndex, cIndex] of faces) {
    const a = vertices[aIndex];
    const b = vertices[bIndex];
    const c = vertices[cIndex];

    for (let u = step; u < 1; u += step) {
      for (let v = step; u + v < 1; v += step) {
        const w = 1 - u - v;
        points.push({
          x: a.x * u + b.x * v + c.x * w,
          y: a.y * u + b.y * v + c.y * w,
          z: a.z * u + b.z * v + c.z * w,
          weight: "face",
        });
      }
    }
  }
};

const addCubeFacePoints = (points: ModelPoint[], step = 0.24) => {
  for (const [aIndex, bIndex, cIndex, dIndex] of cubeFaces) {
    const a = cubeVertices[aIndex];
    const b = cubeVertices[bIndex];
    const c = cubeVertices[cIndex];
    const d = cubeVertices[dIndex];

    for (let u = step; u < 1; u += step) {
      for (let v = step; v < 1; v += step) {
        const top = mixPoint(a, b, u);
        const bottom = mixPoint(d, c, u);
        points.push({ ...mixPoint(top, bottom, v), weight: "face" });
      }
    }
  }
};

const createSpherePoints = (): ModelPoint[] => {
  const points: ModelPoint[] = [];

  for (let phi = 0; phi < Math.PI * 2; phi += 0.18) {
    for (let theta = 0.08; theta < Math.PI; theta += 0.18) {
      points.push({
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
        weight: "surface",
      });
    }
  }

  return points;
};

const createTetrahedronPoints = (): ModelPoint[] => {
  const points: ModelPoint[] = [];

  addEdgePoints(points, tetrahedronVertices, tetrahedronEdges, 0.035);
  addTriangleFacePoints(points, tetrahedronVertices, tetrahedronFaces, 0.17);

  return points;
};

const createCubePoints = (): ModelPoint[] => {
  const points: ModelPoint[] = [];

  addEdgePoints(points, cubeVertices, cubeEdges, 0.035);
  addCubeFacePoints(points, 0.22);

  return points;
};

const createRhombusPoints = (): ModelPoint[] => {
  const points: ModelPoint[] = [];

  addEdgePoints(points, rhombusVertices, rhombusEdges, 0.035);
  addTriangleFacePoints(points, rhombusVertices, rhombusFaces, 0.18);

  return points;
};

const shapePoints: Record<ShapeName, ModelPoint[]> = {
  sphere: createSpherePoints(),
  tetrahedron: createTetrahedronPoints(),
  cube: createCubePoints(),
  rhombus: createRhombusPoints(),
};

const getShapeLayers = (elapsedMs: number) => {
  const totalDuration = SHAPE_DURATION_MS * SHAPE_SEQUENCE.length;
  const loopTime = elapsedMs % totalDuration;
  const shapeIndex = Math.floor(loopTime / SHAPE_DURATION_MS);

  return [{ name: SHAPE_SEQUENCE[shapeIndex], alpha: 1 }];
};

export function AnimatedGeometryLoop() {
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
    const startTime = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const projectPoint = (
      point: Point3D,
      centerX: number,
      centerY: number,
      scale: number,
    ): Point3D => {
      return {
        x: centerX + point.x * scale,
        y: centerY - point.y * scale,
        z: point.z,
      };
    };

    const getAlpha = (point: ModelPoint, depth: number, layerAlpha: number) => {
      if (point.weight === "edge") return (0.18 + depth * 0.68) * layerAlpha;
      if (point.weight === "surface") return (0.2 + depth * 0.8) * layerAlpha;

      return (0.08 + depth * 0.32) * layerAlpha;
    };

    const render = () => {
      const now = performance.now();
      const elapsedMs = prefersReducedMotion ? 0 : now - startTime;
      const time = elapsedMs / 1000;
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scale = Math.min(rect.width, rect.height) * SHAPE_RADIUS_RATIO;
      const points: DrawPoint[] = [];

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const layer of getShapeLayers(elapsedMs)) {
        for (const modelPoint of shapePoints[layer.name]) {
          const rotated = rotatePoint(modelPoint, time, layer.name);
          const depth = clamp((rotated.z + 1) / 2, 0, 1);
          const projected = projectPoint(rotated, centerX, centerY, scale);
          const charIndex = Math.floor(depth * (POINT_CHARS.length - 1));

          points.push({
            ...projected,
            alpha: getAlpha(modelPoint, depth, layer.alpha),
            char: POINT_CHARS[charIndex],
            weight: modelPoint.weight,
          });
        }
      }

      points.sort((a, b) => a.z - b.z);

      for (const point of points) {
        ctx.fillStyle = `rgba(${inkColor}, ${point.alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      }

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
