import { Y } from "./scene.js";
import { rnd, rndI, pick, mkMat, toFlat, mkMesh } from "./utils.js";

const GREENS = [0x1a6b2a, 0x1e7a30, 0x155e22, 0x237a2e, 0x0f5520];
const TRUNKS = [0x6b3a10, 0x5a3008, 0x7a4518, 0x4e2c08];

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

export function placeTrees(scene) {
  const onIsland = (x, z) => Math.hypot(x, z) < 12.5;
  const nearFire = (x, z) => Math.hypot(x, z) < 4.0;
  function place(fn, count, minR, maxR, sc = [1, 1]) {
    for (let i = 0; i < count; i++) {
      let x,
        z,
        tries = 0;
      do {
        const a = rnd(0, Math.PI * 2),
          r = rnd(minR, maxR);
        x = Math.cos(a) * r;
        z = Math.sin(a) * r;
        tries++;
      } while ((!onIsland(x, z) || nearFire(x, z)) && tries < 50);
      if (tries < 50) fn(scene, x, z, rnd(sc[0], sc[1]));
    }
  }
  [
    [-5, -6],
    [-7, -2],
    [-6, 3],
    [-5, 7],
    [5, -6],
    [7, -2],
    [6, 3],
    [5, 7],
    [-9, 0],
    [9, 1],
    [-3, 9],
    [3, 9],
  ].forEach(([x, z]) => roundTree(scene, x, z, rnd(1.0, 1.4)));
  [
    [-8, 6],
    [8, 6],
    [-8, -5],
    [8, -5],
    [-10, 3],
    [10, -3],
    [-4, 10],
    [4, 10],
    [-4, -9],
    [4, -9],
    [0, 11],
    [0, -11],
  ].forEach(([x, z]) => conePine(scene, x, z, rnd(0.9, 1.3)));
  place(bush, 24, 4.0, 12, [0.6, 1.1]);
  place(rockCluster, 14, 3.0, 12, [0.7, 1.3]);
}
