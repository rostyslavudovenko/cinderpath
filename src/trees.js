import * as THREE from "three";
import { Y } from "./scene.js";
import { rnd, rndI, pick, mkMat, toFlat, mkMesh } from "./utils.js";

const GREENS = [
  0x1a6b2a, 0x1e7a30, 0x155e22, 0x237a2e, 0x0f5520, 0x2a8c35, 0x3a9e40,
];
const TRUNKS = [0x6b3a10, 0x5a3008, 0x7a4518, 0x4e2c08, 0x8a5020];

export function conePine(scene, x, z, sc = 1) {
  const g = new THREE.Group();
  const th = rnd(1.8, 2.8) * sc;
  const trunk = mkMesh(
    new THREE.CylinderGeometry(0.12 * sc, 0.22 * sc, th, 6),
    mkMat(pick(TRUNKS)),
  );
  trunk.position.y = th / 2;
  g.add(trunk);
  for (let i = 0; i < 3; i++) {
    const r = (1.05 - i * 0.18) * sc,
      h = (1.9 - i * 0.12) * sc;
    const cone = mkMesh(
      new THREE.ConeGeometry(r, h, rndI(6, 8)),
      mkMat(pick(GREENS)),
    );
    cone.position.y = th + 0.15 * sc + i * (h * 0.52);
    cone.rotation.y = rnd(0, Math.PI * 2);
    g.add(cone);
  }
  g.position.set(x, Y, z);
  g.rotation.y = rnd(0, Math.PI * 2);
  scene.add(g);
}

export function roundTree(scene, x, z, sc = 1) {
  const g = new THREE.Group();
  const th = rnd(2.0, 3.2) * sc;
  const trunk = mkMesh(
    new THREE.CylinderGeometry(0.18 * sc, 0.3 * sc, th, 7),
    mkMat(pick(TRUNKS)),
  );
  trunk.position.y = th / 2;
  g.add(trunk);
  const fr = rnd(1.0, 1.4) * sc;
  const fol = mkMesh(
    toFlat(new THREE.IcosahedronGeometry(fr, 1)),
    mkMat(pick(GREENS)),
  );
  fol.position.y = th + fr * 0.65;
  g.add(fol);
  if (Math.random() > 0.4) {
    const fol2 = mkMesh(
      toFlat(new THREE.IcosahedronGeometry(fr * 0.65, 1)),
      mkMat(pick(GREENS)),
    );
    fol2.position.set(rnd(-0.5, 0.5) * sc, th + fr * 0.2, rnd(-0.5, 0.5) * sc);
    g.add(fol2);
  }
  g.position.set(x, Y, z);
  g.rotation.y = rnd(0, Math.PI * 2);
  scene.add(g);
}

export function clusterTree(scene, x, z, sc = 1) {
  const g = new THREE.Group();
  const th = rnd(1.8, 3.0) * sc;
  const trunk = mkMesh(
    new THREE.CylinderGeometry(0.14 * sc, 0.28 * sc, th, 7),
    mkMat(pick(TRUNKS)),
  );
  trunk.position.y = th / 2;
  g.add(trunk);
  const mainR = rnd(0.7, 1.1) * sc;
  const mainBall = mkMesh(
    toFlat(new THREE.IcosahedronGeometry(mainR, 1)),
    mkMat(pick(GREENS)),
  );
  mainBall.position.y = th + mainR * 0.7;
  g.add(mainBall);
  for (let i = 0; i < rndI(5, 10); i++) {
    const r = rnd(0.3, 0.75) * sc;
    const a = rnd(0, Math.PI * 2);
    const ball = mkMesh(
      toFlat(new THREE.IcosahedronGeometry(r, 1)),
      mkMat(pick(GREENS)),
    );
    ball.position.set(
      Math.cos(a) * rnd(0.4, mainR * 1.1),
      th + rnd(0, mainR * 1.2),
      Math.sin(a) * rnd(0.4, mainR * 1.1),
    );
    g.add(ball);
  }
  g.position.set(x, Y, z);
  g.rotation.y = rnd(0, Math.PI * 2);
  scene.add(g);
}

export function layeredPine(scene, x, z, sc = 1) {
  const g = new THREE.Group();
  const th = rnd(1.5, 2.5) * sc;
  const trunk = mkMesh(
    new THREE.CylinderGeometry(0.1 * sc, 0.18 * sc, th, 6),
    mkMat(pick(TRUNKS)),
  );
  trunk.position.y = th / 2;
  g.add(trunk);
  const layers = rndI(4, 7);
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    const r = (1.4 - t * 0.9) * sc,
      h = (0.5 + (1 - t) * 0.4) * sc;
    const layer = mkMesh(
      new THREE.ConeGeometry(r, h, rndI(7, 10)),
      mkMat(pick(GREENS)),
    );
    layer.position.y = th + 0.1 * sc + i * (h * 0.75);
    layer.rotation.y = rnd(0, Math.PI * 2);
    g.add(layer);
  }
  g.position.set(x, Y, z);
  g.rotation.y = rnd(0, Math.PI * 2);
  scene.add(g);
}

export function poplar(scene, x, z, sc = 1) {
  const g = new THREE.Group();
  const th = rnd(2.5, 4.0) * sc;
  const trunk = mkMesh(
    new THREE.CylinderGeometry(0.1 * sc, 0.16 * sc, th, 6),
    mkMat(pick(TRUNKS)),
  );
  trunk.position.y = th / 2;
  g.add(trunk);
  const fw = rnd(0.45, 0.65) * sc;
  const fh = rnd(1.4, 2.2) * sc;
  const fol = mkMesh(
    toFlat(new THREE.IcosahedronGeometry(fw, 1)),
    mkMat(pick(GREENS)),
  );
  fol.scale.y = fh / fw;
  fol.position.y = th + fw * 0.5;
  g.add(fol);
  g.position.set(x, Y, z);
  g.rotation.y = rnd(0, Math.PI * 2);
  scene.add(g);
}

export function bush(scene, x, z, sc = 1) {
  const g = new THREE.Group();
  for (let i = 0; i < rndI(2, 4); i++) {
    const r = rnd(0.28, 0.5) * sc;
    const b = mkMesh(
      toFlat(new THREE.IcosahedronGeometry(r, 0)),
      mkMat(pick(GREENS)),
    );
    b.position.set(rnd(-0.25, 0.25) * sc, r * 0.9, rnd(-0.25, 0.25) * sc);
    g.add(b);
  }
  g.position.set(x, Y, z);
  scene.add(g);
}

export function rockCluster(scene, x, z, sc = 1) {
  const GRAYS = [0x3a4048, 0x454d55, 0x4a5260, 0x556070];
  for (let i = 0; i < rndI(1, 4); i++) {
    const size = rnd(0.2, 0.4) * sc;
    const r = mkMesh(
      toFlat(new THREE.DodecahedronGeometry(size, 0)),
      mkMat(pick(GRAYS)),
    );
    r.position.set(x + rnd(-0.35, 0.35), Y + size * 0.45, z + rnd(-0.35, 0.35));
    r.scale.y = 0.55;
    r.rotation.y = rnd(0, Math.PI);
    scene.add(r);
  }
}

// Hex grid — 225 evenly spaced points covering the island
// Each point gets a random tree or left empty; guarantees dense uniform coverage
const GRID = [
  [-4.8, -24.9],
  [-1.6, -24.9],
  [1.6, -24.9],
  [4.8, -24.9],
  [-9.6, -22.2],
  [-6.4, -22.2],
  [-3.2, -22.2],
  [0.0, -22.2],
  [3.2, -22.2],
  [6.4, -22.2],
  [9.6, -22.2],
  [-14.4, -19.4],
  [-11.2, -19.4],
  [-8.0, -19.4],
  [-4.8, -19.4],
  [-1.6, -19.4],
  [1.6, -19.4],
  [4.8, -19.4],
  [8.0, -19.4],
  [11.2, -19.4],
  [14.4, -19.4],
  [-19.2, -16.6],
  [-16.0, -16.6],
  [-12.8, -16.6],
  [-9.6, -16.6],
  [-6.4, -16.6],
  [-3.2, -16.6],
  [0.0, -16.6],
  [3.2, -16.6],
  [6.4, -16.6],
  [9.6, -16.6],
  [12.8, -16.6],
  [16.0, -16.6],
  [19.2, -16.6],
  [-20.8, -13.9],
  [-17.6, -13.9],
  [-14.4, -13.9],
  [-11.2, -13.9],
  [-8.0, -13.9],
  [-4.8, -13.9],
  [-1.6, -13.9],
  [1.6, -13.9],
  [4.8, -13.9],
  [8.0, -13.9],
  [11.2, -13.9],
  [14.4, -13.9],
  [17.6, -13.9],
  [20.8, -13.9],
  [-22.4, -11.1],
  [-19.2, -11.1],
  [-16.0, -11.1],
  [-12.8, -11.1],
  [-9.6, -11.1],
  [-6.4, -11.1],
  [-3.2, -11.1],
  [0.0, -11.1],
  [3.2, -11.1],
  [6.4, -11.1],
  [9.6, -11.1],
  [12.8, -11.1],
  [16.0, -11.1],
  [19.2, -11.1],
  [22.4, -11.1],
  [-24.0, -8.3],
  [-20.8, -8.3],
  [-17.6, -8.3],
  [-14.4, -8.3],
  [-11.2, -8.3],
  [-8.0, -8.3],
  [-4.8, -8.3],
  [-1.6, -8.3],
  [1.6, -8.3],
  [4.8, -8.3],
  [8.0, -8.3],
  [11.2, -8.3],
  [14.4, -8.3],
  [17.6, -8.3],
  [20.8, -8.3],
  [24.0, -8.3],
  [-22.4, -5.5],
  [-19.2, -5.5],
  [-16.0, -5.5],
  [-12.8, -5.5],
  [-9.6, -5.5],
  [-6.4, -5.5],
  [-3.2, -5.5],
  [0.0, -5.5],
  [3.2, -5.5],
  [9.6, -5.5],
  [12.8, -5.5],
  [16.0, -5.5],
  [19.2, -5.5],
  [22.4, -5.5],
  [-24.0, -2.8],
  [-20.8, -2.8],
  [-17.6, -2.8],
  [-14.4, -2.8],
  [-11.2, -2.8],
  [-8.0, -2.8],
  [-4.8, -2.8],
  [11.2, -2.8],
  [14.4, -2.8],
  [17.6, -2.8],
  [20.8, -2.8],
  [24.0, -2.8],
  [-22.4, 0.0],
  [-19.2, 0.0],
  [-16.0, 0.0],
  [-12.8, 0.0],
  [-9.6, 0.0],
  [-6.4, 0.0],
  [6.4, 0.0],
  [9.6, 0.0],
  [12.8, 0.0],
  [16.0, 0.0],
  [19.2, 0.0],
  [22.4, 0.0],
  [-24.0, 2.8],
  [-20.8, 2.8],
  [-17.6, 2.8],
  [-14.4, 2.8],
  [-11.2, 2.8],
  [-8.0, 2.8],
  [-4.8, 2.8],
  [4.8, 2.8],
  [8.0, 2.8],
  [11.2, 2.8],
  [14.4, 2.8],
  [17.6, 2.8],
  [20.8, 2.8],
  [24.0, 2.8],
  [-22.4, 5.5],
  [-19.2, 5.5],
  [-16.0, 5.5],
  [-12.8, 5.5],
  [-9.6, 5.5],
  [-6.4, 5.5],
  [-3.2, 5.5],
  [0.0, 5.5],
  [3.2, 5.5],
  [6.4, 5.5],
  [9.6, 5.5],
  [12.8, 5.5],
  [16.0, 5.5],
  [19.2, 5.5],
  [22.4, 5.5],
  [-24.0, 8.3],
  [-20.8, 8.3],
  [-17.6, 8.3],
  [-14.4, 8.3],
  [-11.2, 8.3],
  [-8.0, 8.3],
  [-4.8, 8.3],
  [-1.6, 8.3],
  [1.6, 8.3],
  [4.8, 8.3],
  [8.0, 8.3],
  [11.2, 8.3],
  [14.4, 8.3],
  [17.6, 8.3],
  [20.8, 8.3],
  [24.0, 8.3],
  [-22.4, 11.1],
  [-19.2, 11.1],
  [-16.0, 11.1],
  [-12.8, 11.1],
  [-9.6, 11.1],
  [-6.4, 11.1],
  [-3.2, 11.1],
  [0.0, 11.1],
  [3.2, 11.1],
  [6.4, 11.1],
  [9.6, 11.1],
  [12.8, 11.1],
  [16.0, 11.1],
  [19.2, 11.1],
  [22.4, 11.1],
  [-20.8, 13.9],
  [-17.6, 13.9],
  [-14.4, 13.9],
  [-11.2, 13.9],
  [-8.0, 13.9],
  [-4.8, 13.9],
  [-1.6, 13.9],
  [1.6, 13.9],
  [4.8, 13.9],
  [8.0, 13.9],
  [11.2, 13.9],
  [14.4, 13.9],
  [17.6, 13.9],
  [20.8, 13.9],
  [-19.2, 16.6],
  [-16.0, 16.6],
  [-12.8, 16.6],
  [-9.6, 16.6],
  [-6.4, 16.6],
  [-3.2, 16.6],
  [0.0, 16.6],
  [3.2, 16.6],
  [6.4, 16.6],
  [9.6, 16.6],
  [12.8, 16.6],
  [16.0, 16.6],
  [19.2, 16.6],
  [-14.4, 19.4],
  [-11.2, 19.4],
  [-8.0, 19.4],
  [-4.8, 19.4],
  [-1.6, 19.4],
  [1.6, 19.4],
  [4.8, 19.4],
  [8.0, 19.4],
  [11.2, 19.4],
  [14.4, 19.4],
  [-9.6, 22.2],
  [-6.4, 22.2],
  [-3.2, 22.2],
  [0.0, 22.2],
  [3.2, 22.2],
  [6.4, 22.2],
  [9.6, 22.2],
  [-4.8, 24.9],
  [-1.6, 24.9],
  [1.6, 24.9],
  [4.8, 24.9],
];

const TREE_FNS = [
  conePine,
  conePine,
  roundTree,
  roundTree,
  clusterTree,
  layeredPine,
  poplar,
];

export function placeTrees(scene) {
  const nearFire = (x, z) => Math.hypot(x, z) < 3.5;

  GRID.forEach(([x, z]) => {
    if (nearFire(x, z)) return;

    // jitter each point so it doesn't look like a grid
    const jx = x + rnd(-1.0, 1.0);
    const jz = z + rnd(-1.0, 1.0);

    const roll = Math.random();
    if (roll < 0.15) {
      // empty spot — natural gaps
    } else if (roll < 0.3) {
      rockCluster(scene, jx, jz, rnd(0.7, 1.3));
    } else if (roll < 0.5) {
      bush(scene, jx, jz, rnd(0.6, 1.2));
    } else {
      const fn = TREE_FNS[Math.floor(Math.random() * TREE_FNS.length)];
      fn(scene, jx, jz, rnd(0.9, 1.4));
    }
  });
}
