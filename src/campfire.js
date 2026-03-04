import * as THREE from "three";
import { Y } from "./scene.js";
import { rnd, pick, mkMat, toFlat } from "./utils.js";

export function buildCampfire(scene) {
  // ── STONE RING ────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const size = 0.13 + rnd(0, 0.06);
    const s = new THREE.Mesh(
      toFlat(new THREE.DodecahedronGeometry(size, 0)),
      mkMat(pick([0x4a5260, 0x3d4550, 0x5a6070])),
    );
    s.position.set(Math.cos(a) * 0.85, Y + size * 0.5, Math.sin(a) * 0.85);
    s.scale.y = 0.5;
    s.rotation.y = rnd(0, Math.PI);
    s.castShadow = true;
    scene.add(s);
  }

  // ── EMBERS ───────────────────────────────────────
  const em = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 10),
    new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.75,
    }),
  );
  em.rotation.x = -Math.PI / 2;
  em.position.y = Y + 0.01;
  scene.add(em);

  // ── LOGS ─────────────────────────────────────────
  const logColor = () => pick([0xc87832, 0xb06820, 0xd09040, 0x9a5018]);
  const logMat = (c) =>
    new THREE.MeshPhongMaterial({
      color: c,
      flatShading: true,
      emissive: 0x3a1200,
      emissiveIntensity: 0.4,
    });

  // Bottom layer: 3 logs on ground fanning out
  [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((angle) => {
    const geo = new THREE.CylinderGeometry(0.08, 0.11, 1.5, 6);
    const log = new THREE.Mesh(geo, logMat(logColor()));
    log.rotation.order = "YXZ";
    log.rotation.y = angle + rnd(-0.15, 0.15);
    log.rotation.z = Math.PI / 2;
    log.rotation.x = rnd(-0.1, 0.1);
    log.position.set(Math.cos(angle) * 0.15, Y + 0.08, Math.sin(angle) * 0.15);
    log.castShadow = true;
    log.receiveShadow = true;
    scene.add(log);
  });

  // Middle layer: 2 logs resting on bottom
  [Math.PI / 6, Math.PI / 6 + Math.PI / 2].forEach((angle) => {
    const geo = new THREE.CylinderGeometry(0.07, 0.09, 1.3, 6);
    const log = new THREE.Mesh(geo, logMat(logColor()));
    log.rotation.order = "YXZ";
    log.rotation.y = angle + rnd(-0.1, 0.1);
    log.rotation.z = Math.PI / 2;
    log.rotation.x = rnd(-0.08, 0.08);
    log.position.set(Math.cos(angle) * 0.1, Y + 0.22, Math.sin(angle) * 0.1);
    log.castShadow = true;
    log.receiveShadow = true;
    scene.add(log);
  });

  // Top log
  {
    const geo = new THREE.CylinderGeometry(0.06, 0.07, 1.1, 6);
    const log = new THREE.Mesh(geo, logMat(logColor()));
    log.rotation.order = "YXZ";
    log.rotation.y = rnd(0.3, 0.8);
    log.rotation.z = Math.PI / 2;
    log.position.set(rnd(-0.05, 0.05), Y + 0.33, rnd(-0.05, 0.05));
    log.castShadow = true;
    scene.add(log);
  }

  // Charred center
  const charTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.3, 0.08, 7),
    new THREE.MeshPhongMaterial({
      color: 0x0d0600,
      flatShading: true,
      emissive: 0x5a1500,
      emissiveIntensity: 0.9,
    }),
  );
  charTop.position.set(0, Y + 0.1, 0);
  scene.add(charTop);

  // ── FLAMES ───────────────────────────────────────
  const flameGroup = new THREE.Group();
  flameGroup.position.set(0, Y + 0.35, 0);
  [
    { r: 0.22, h: 0.6, y: 0.3, color: 0xff4400, em: 0xff2200, ei: 1.0, seg: 5 },
    { r: 0.15, h: 0.8, y: 0.4, color: 0xff8800, em: 0xff5500, ei: 1.1, seg: 5 },
    { r: 0.08, h: 1.0, y: 0.5, color: 0xffee00, em: 0xffcc00, ei: 1.4, seg: 4 },
  ].forEach((f) => {
    const geo = toFlat(new THREE.ConeGeometry(f.r, f.h, f.seg));
    const mat = new THREE.MeshPhongMaterial({
      color: f.color,
      flatShading: true,
      emissive: f.em,
      emissiveIntensity: f.ei,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const c = new THREE.Mesh(geo, mat);
    c.position.y = f.y;
    flameGroup.add(c);
  });
  scene.add(flameGroup);
  return flameGroup;
}
