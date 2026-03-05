import * as THREE from "three";
import { Y } from "./scene.js";

// River path — winds through left side of island, away from campfire (which is at ~5.5, -3.5)
const PATH_PTS = [
  [-6, -24],
  [-8, -16],
  [-6, -8],
  [-9, 0],
  [-8, 8],
  [-6, 16],
  [-7, 24],
];

const WIDTH = 3.0;
const BANK_W = 0.15; // extra width of hole beyond water edge
const SEGMENTS_L = 80;
const SEGMENTS_W = 6;
const WAVE_AMP = 0.05;
const WAVE_SPEED = 1.4;

let riverGeo = null;
let basePositions = null;

function makeCurve() {
  return new THREE.CatmullRomCurve3(
    PATH_PTS.map(([x, z]) => new THREE.Vector3(x, Y, z)),
  );
}

// Returns outline polygon [{ x, z }] for island hole — called before buildRiver
export function getRiverHole() {
  const curve = new THREE.CatmullRomCurve3(
    PATH_PTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  );
  const hw = WIDTH / 2 + BANK_W;
  const left = [],
    right = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pt = curve.getPoint(t);
    const tan = curve.getTangent(t).normalize();
    const rx = -tan.z,
      rz = tan.x;
    left.push({ x: pt.x - rx * hw, z: pt.z - rz * hw });
    right.push({ x: pt.x + rx * hw, z: pt.z + rz * hw });
  }
  return [...left, ...[...right].reverse()];
}

function buildRibbon(curve, width, yLevel) {
  const totalVerts = (SEGMENTS_L + 1) * (SEGMENTS_W + 1);
  const positions = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const indices = [];

  for (let i = 0; i <= SEGMENTS_L; i++) {
    const t = i / SEGMENTS_L;
    const pt = curve.getPoint(t);
    const tan = curve.getTangent(t).normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
    for (let j = 0; j <= SEGMENTS_W; j++) {
      const w = (j / SEGMENTS_W - 0.5) * width;
      const vi = i * (SEGMENTS_W + 1) + j;
      positions[vi * 3 + 0] = pt.x + right.x * w;
      positions[vi * 3 + 1] = yLevel;
      positions[vi * 3 + 2] = pt.z + right.z * w;
      uvs[vi * 2 + 0] = j / SEGMENTS_W;
      uvs[vi * 2 + 1] = t * 8;
    }
  }
  for (let i = 0; i < SEGMENTS_L; i++) {
    for (let j = 0; j < SEGMENTS_W; j++) {
      const a = i * (SEGMENTS_W + 1) + j;
      const b = (i + 1) * (SEGMENTS_W + 1) + j;
      const c = (i + 1) * (SEGMENTS_W + 1) + j + 1;
      const d = i * (SEGMENTS_W + 1) + j + 1;
      indices.push(a, b, c, a, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return { geo, positions };
}

export function buildRiver(scene) {
  const curve = makeCurve();

  // Bottom floor — solid dark plane covering the hole so stars don't show through
  const { geo: floorGeo } = buildRibbon(
    curve,
    WIDTH + BANK_W * 2 + 1.0,
    Y - 2.5,
  );
  scene.add(
    new THREE.Mesh(
      floorGeo,
      new THREE.MeshPhongMaterial({
        color: 0x0f1a0e,
        flatShading: true,
        side: THREE.DoubleSide,
      }),
    ),
  );

  // Dark riverbed — fills the hole in the island
  const { geo: bedGeo } = buildRibbon(curve, WIDTH + BANK_W * 2, Y - 0.05);
  scene.add(
    new THREE.Mesh(
      bedGeo,
      new THREE.MeshPhongMaterial({ color: 0x1a2a18, flatShading: true }),
    ),
  );

  // Water surface
  const { geo, positions } = buildRibbon(curve, WIDTH, Y + 0.02);
  riverGeo = geo;
  basePositions = positions.slice();

  scene.add(
    new THREE.Mesh(
      riverGeo,
      new THREE.MeshPhongMaterial({
        color: 0x2a6ea6,
        emissive: 0x0a2a4a,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.88,
        flatShading: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    ),
  );

  // Sloped banks — smooth transition from island surface down to water
  _addSlopedBanks(scene, curve);

  // Foam along banks
  _addFoam(scene, curve, +1);
  _addFoam(scene, curve, -1);
}

function _addFoam(scene, curve, side) {
  const pts = [];
  for (let i = 0; i <= SEGMENTS_L; i++) {
    const t = i / SEGMENTS_L;
    const pt = curve.getPoint(t);
    const tan = curve.getTangent(t).normalize();
    const right = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
    const w = side * (WIDTH / 2 + 0.06);
    pts.push(
      new THREE.Vector3(pt.x + right.x * w, Y + 0.04, pt.z + right.z * w),
    );
  }
  scene.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(pts),
        SEGMENTS_L,
        0.045,
        4,
        false,
      ),
      new THREE.MeshBasicMaterial({
        color: 0x8bbcda,
        transparent: true,
        opacity: 0.4,
      }),
    ),
  );
}

function _addSlopedBanks(scene, curve) {
  const steps = SEGMENTS_L;
  const waterEdge = WIDTH / 2;
  const holeEdge = waterEdge + BANK_W;
  const SLOPE_W = 1.2; // how far the slope extends into the island

  for (const side of [+1, -1]) {
    const verts = [];
    const idx = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = curve.getPoint(t);
      const tan = curve.getTangent(t).normalize();
      const rx = -tan.z * side,
        rz = tan.x * side;

      // inner edge of slope = hole edge (at Y)
      const ix = pt.x + rx * holeEdge;
      const iz = pt.z + rz * holeEdge;
      // outer edge of slope = on island surface, slightly further out
      const ox = pt.x + rx * (holeEdge + SLOPE_W);
      const oz = pt.z + rz * (holeEdge + SLOPE_W);

      // inner point: at Y - 0.08 (slightly below surface, blends into riverbed)
      verts.push(ix, Y - 0.08, iz);
      // outer point: at Y + 0.01 (flush with island surface)
      verts.push(ox, Y + 0.01, oz);
    }

    for (let i = 0; i < steps; i++) {
      const a = i * 2,
        b = i * 2 + 1,
        c = i * 2 + 3,
        d = i * 2 + 2;
      if (side > 0) idx.push(a, b, c, a, c, d);
      else idx.push(a, c, b, a, d, c);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    scene.add(
      new THREE.Mesh(
        geo,
        new THREE.MeshPhongMaterial({
          color: 0x1e3a20,
          flatShading: true,
          side: THREE.DoubleSide,
        }),
      ),
    );
  }
}

export function animateRiver(t) {
  if (!riverGeo || !basePositions) return;
  const pos = riverGeo.attributes.position;
  for (let i = 0; i <= SEGMENTS_L; i++) {
    for (let j = 0; j <= SEGMENTS_W; j++) {
      const vi = i * (SEGMENTS_W + 1) + j;
      const wave =
        Math.sin(i * 0.25 - t * WAVE_SPEED * 3.0) * WAVE_AMP +
        Math.sin(j * 0.8 + t * WAVE_SPEED * 1.5) * WAVE_AMP * 0.4 +
        Math.sin(i * 0.1 + j * 0.5 - t * WAVE_SPEED * 2.0) * WAVE_AMP * 0.3;
      pos.setY(vi, basePositions[vi * 3 + 1] + wave);
    }
  }
  pos.needsUpdate = true;
  riverGeo.computeVertexNormals();
}
