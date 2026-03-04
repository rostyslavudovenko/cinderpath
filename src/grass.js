import * as THREE from "three";
import { Y } from "./scene.js";

const blades = [];

export function buildGrass(scene) {
  const COLORS = [0x4a8c2a, 0x3a7820, 0x568c30, 0x2e6618, 0x4ea028];

  function blade(x, z, h, angle, color) {
    const w = 0.03 + Math.random() * 0.02;
    const lean = (Math.random() - 0.5) * 0.15;
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([-w, 0, 0, w, 0, 0, lean, h, 0], 3),
    );
    const m = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
    );
    m.position.set(x, Y, z);
    m.rotation.y = angle;
    blades.push({
      geo: g,
      phase: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 0.8,
      amp: 0.04 + Math.random() * 0.06,
      h,
    });
    return m;
  }

  function clump(cx, cz) {
    const g = new THREE.Group();
    const count = 7 + Math.floor(Math.random() * 6);
    const base = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < count; i++) {
      const ox = (Math.random() - 0.5) * 0.18;
      const oz = (Math.random() - 0.5) * 0.18;
      const h = 0.22 + Math.random() * 0.28;
      const br = 0.85 + Math.random() * 0.3;
      const r = Math.min(255, ((base >> 16) & 0xff) * br);
      const gv = Math.min(255, ((base >> 8) & 0xff) * br);
      const b = Math.min(255, (base & 0xff) * br);
      g.add(
        blade(
          cx + ox,
          cz + oz,
          h,
          Math.random() * Math.PI,
          (r << 16) | (gv << 8) | b,
        ),
      );
    }
    scene.add(g);
  }

  const ok = (x, z) =>
    Math.hypot(x, z) < 23 &&
    Math.hypot(x, z) > 1.0 &&
    Math.hypot(x - 5.5, z + 3.5) > 2.2;

  [
    [1.5, 1],
    [-1.5, 1],
    [1, -1.5],
    [-1, -1.5],
    [2.5, 0.5],
    [-2.5, 0.5],
    [0.5, 2.5],
    [0.5, -2.5],
    [2, 2],
    [-2, 2],
    [2, -2],
    [-2, -2],
    [3, 0.5],
    [-3, 0.5],
    [0.5, 3],
    [0.5, -3],
    [2.8, 1.5],
    [-2.8, 1.5],
    [1.5, 2.8],
    [1.5, -2.8],
    [-4, 2],
    [3, -3],
    [-2, 5],
    [6, 2],
    [-6, -3],
    [2, 7],
    [-5, 6],
    [7, -4],
    [-8, 1],
    [4, -7],
    [-3, -6],
    [8, 3],
    [-7, 4],
    [1, 9],
    [-1, -8],
    [5, 5],
    [-6, -6],
    [9, -1],
    [-9, 2],
    [3, -9],
    [6, -7],
    [-4, 8],
    [7, 6],
    [-8, -4],
    [2, -5],
    [-5, -2],
    [4, 4],
    [-2, -3],
    [6, -1],
    [-7, 7],
    [1, -7],
    [8, -5],
    [-3, 3],
    [5, -5],
    [-6, 2],
    [3, 6],
    [-1, 4],
    [7, 1],
    [-9, -1],
    [4, -4],
    [0, 7],
    [-4, -8],
    [8, -3],
    [-2, 8],
    [5, 3],
    [-7, -1],
    [2, -9],
    [6, 8],
    [-8, 5],
    [1, 5],
    [12, 8],
    [-12, 8],
    [8, 14],
    [-8, 14],
    [15, 3],
    [-15, 3],
    [10, -12],
    [-10, -12],
    [18, 0],
    [-18, 0],
    [0, 18],
    [0, -18],
    [14, -8],
    [-14, -8],
    [16, 6],
    [-16, -6],
    [12, -14],
    [-12, 14],
    [6, 17],
    [-6, -17],
    [20, 2],
    [-20, -2],
    [4, 20],
    [-4, -20],
    [11, 5],
    [-11, 5],
    [5, 11],
    [-5, 11],
    [13, 0],
    [-13, 0],
    [0, 13],
    [0, -13],
    [15, 7],
    [-15, 7],
    [7, 15],
    [-7, 15],
    [17, 4],
    [-17, 4],
    [4, 17],
    [-4, 17],
    [19, 2],
    [-19, 2],
    [2, 19],
    [-2, 19],
  ].forEach(([x, z]) => {
    if (ok(x, z)) {
      clump(x, z);
      if (Math.random() > 0.2) {
        const ox = x + (Math.random() - 0.5) * 0.9;
        const oz = z + (Math.random() - 0.5) * 0.9;
        if (ok(ox, oz)) clump(ox, oz);
      }
    }
  });
}

export function animateGrass(t) {
  for (const b of blades) {
    const wave =
      Math.sin(t * b.speed + b.phase) * b.amp +
      Math.sin(t * b.speed * 1.9 + b.phase * 1.4) * b.amp * 0.25;
    const pos = b.geo.attributes.position;
    pos.setX(2, wave * b.h * 2.2);
    pos.setZ(2, wave * b.h * 0.5);
    pos.needsUpdate = true;
  }
}
