import * as THREE from "three";
//import { Y } from "./scene.js";
import { rnd, rndI, pick, mkMat, toFlat, mkMesh } from "./utils.js";

export function buildIsland(scene) {
  const shape = new THREE.Shape();
  const N = 10,
    R = 28;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 8;
    i === 0
      ? shape.moveTo(Math.cos(a) * R, Math.sin(a) * R)
      : shape.lineTo(Math.cos(a) * R, Math.sin(a) * R);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 2.2,
    bevelEnabled: true,
    bevelThickness: 0.6,
    bevelSize: 0.5,
    bevelSegments: 1,
  });
  const m = new THREE.Mesh(geo, [mkMat(0x1e4028), mkMat(0xa07830)]);
  m.rotation.x = -Math.PI / 2;
  m.position.y = -2.7;
  m.receiveShadow = true;
  scene.add(m);
}

export function buildSky(scene, camera) {
  // Stars
  const verts = [];
  for (let i = 0; i < 3000; i++) {
    const th = rnd(0, Math.PI * 2),
      ph = Math.acos(rnd(-1, 1)),
      r = rnd(70, 110);
    verts.push(
      r * Math.sin(ph) * Math.cos(th),
      r * Math.sin(ph) * Math.sin(th),
      r * Math.cos(ph),
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  scene.add(
    new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.25,
        transparent: true,
        opacity: 0.9,
      }),
    ),
  );

  // Moon
  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 14),
    new THREE.MeshBasicMaterial({ color: 0xddeeff }),
  );
  moon.position.set(-30, 38, -45);
  moon.lookAt(camera.position);
  scene.add(moon);
}
