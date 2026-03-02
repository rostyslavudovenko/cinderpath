import { Y } from "./scene.js";

export function buildTent(scene) {
  const TX = 5.5,
    TZ = -3.5;

  const tentMat = new THREE.MeshBasicMaterial({
    color: 0xcc4400,
    side: THREE.DoubleSide,
  });
  const darkMat = new THREE.MeshBasicMaterial({
    color: 0x991f00,
    side: THREE.DoubleSide,
  });
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x1a0800 });
  const doorMat = new THREE.MeshBasicMaterial({
    color: 0x0a0200,
    side: THREE.DoubleSide,
  });
  const poleMat = new THREE.MeshBasicMaterial({ color: 0x7a4010 });
  const pegMat = new THREE.MeshBasicMaterial({ color: 0xbbaa88 });
  const ropeMat = new THREE.MeshBasicMaterial({ color: 0xaa8844 });

  function tri(ax, ay, az, bx, by, bz, cx, cy, cz, mat) {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([ax, ay, az, bx, by, bz, cx, cy, cz], 3),
    );
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    return m;
  }
  function quad(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, mat) {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          ax,
          ay,
          az,
          bx,
          by,
          bz,
          cx,
          cy,
          cz,
          ax,
          ay,
          az,
          cx,
          cy,
          cz,
          dx,
          dy,
          dz,
        ],
        3,
      ),
    );
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    return m;
  }

  const W = 1.2,
    D = 1.2,
    H = 1.7;
  const g = new THREE.Group();
  g.position.set(TX, Y, TZ);
  g.rotation.y = -Math.PI / 6;

  // Roof panels
  g.add(quad(-W, 0, D, -W, 0, -D, 0, H, -D, 0, H, D, darkMat));
  g.add(quad(W, 0, D, 0, H, D, 0, H, -D, W, 0, -D, tentMat));
  // Front & back triangles
  g.add(tri(-W, 0, D, W, 0, D, 0, H, D, tentMat));
  g.add(tri(W, 0, -D, -W, 0, -D, 0, H, -D, darkMat));
  // Floor
  g.add(quad(-W, 0, D, W, 0, D, W, 0, -D, -W, 0, -D, floorMat));
  // Door
  g.add(tri(-0.5, 0, D + 0.01, 0.5, 0, D + 0.01, 0, 0.95, D + 0.01, doorMat));

  const ridgeLen = D * 2;
  const ridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, ridgeLen, 5),
    poleMat,
  );
  // Rotate to lie along Z axis
  ridge.rotation.x = Math.PI / 2;
  ridge.position.set(0, H, 0);
  g.add(ridge);

  // Pegs + ropes to roof corners
  // Each peg is outside a roof corner: (±W, 0, ±D) → peg at (±W*1.3, 0, ±D*1.3)
  const roofCorners = [
    [-W, 0, D],
    [W, 0, D],
    [-W, 0, -D],
    [W, 0, -D],
  ];

  roofCorners.forEach(([cx, cy, cz]) => {
    const px = cx * 1.35;
    const pz = cz * 1.35;
    const pegH = 0.5;
    const pegTopY = 0.32; // visible above ground

    // Peg
    const peg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.025, pegH, 5),
      pegMat,
    );
    peg.position.set(px, pegTopY, pz);
    // Tilt outward from tent center
    peg.rotation.z = cx > 0 ? 0.3 : -0.3;
    peg.rotation.x = cz > 0 ? 0.3 : -0.3;
    peg.castShadow = true;
    g.add(peg);

    // Rope: from roof corner (cx, 0, cz) up to peg top
    const rStartX = cx,
      rStartY = 0.05,
      rStartZ = cz; // near ground at corner
    const rEndX = px,
      rEndY = pegTopY + 0.15,
      rEndZ = pz;

    const dx = rEndX - rStartX;
    const dy = rEndY - rStartY;
    const dz = rEndZ - rStartZ;
    const ropeLen = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const rope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, ropeLen, 3),
      ropeMat,
    );
    // Position at midpoint
    rope.position.set(
      (rStartX + rEndX) / 2,
      (rStartY + rEndY) / 2,
      (rStartZ + rEndZ) / 2,
    );
    // Orient along the rope direction
    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(rope);
  });

  scene.add(g);
}
