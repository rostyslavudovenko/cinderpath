import { Y } from "./scene.js";

export function initControls(renderer, camera) {
  // ── STATE ──────────────────────────────────────────
  const player = {
    pos: new THREE.Vector3(3, Y + 1.65, 3), // eye height
    yaw: 0.1, // left/right (mouse X)
    pitch: 0, // up/down   (mouse Y)
    bobT: 0, // walk bob timer
  };

  const keys = {};
  let locked = false;

  // ── POINTER LOCK ──────────────────────────────────
  renderer.domElement.addEventListener("click", () => {
    renderer.domElement.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", () => {
    locked = document.pointerLockElement === renderer.domElement;
    document.getElementById("hint").style.opacity = locked ? "0" : "1";
  });

  document.addEventListener("mousemove", (e) => {
    if (!locked) return;
    player.yaw -= e.movementX * 0.002;
    player.pitch -= e.movementY * 0.002;
    // Clamp pitch: can't look fully up/down
    player.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, player.pitch));
  });

  addEventListener("keydown", (e) => {
    keys[e.code] = true;
  });
  addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  // ── HINT ───────────────────────────────────────────
  const hint = document.getElementById("hint");
  hint.innerHTML =
    "Click to start &nbsp;|&nbsp; WASD — move &nbsp;|&nbsp; mouse — look &nbsp;|&nbsp; ESC — exit";

  // ── UPDATE ─────────────────────────────────────────
  const SPEED = 0.08;
  const EYE_H = Y + 1.65;
  const BOB_SPEED = 8;
  const BOB_AMP = 0.055;
  const ISLAND_R = 26.0;

  // Direction vectors
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");

  return {
    update(dt) {
      const moving =
        keys["KeyW"] ||
        keys["ArrowUp"] ||
        keys["KeyS"] ||
        keys["ArrowDown"] ||
        keys["KeyA"] ||
        keys["ArrowLeft"] ||
        keys["KeyD"] ||
        keys["ArrowRight"];

      if (locked && moving) {
        // Forward = horizontal projection of look direction
        fwd.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
        right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw));

        if (keys["KeyW"] || keys["ArrowUp"])
          player.pos.addScaledVector(fwd, SPEED);
        if (keys["KeyS"] || keys["ArrowDown"])
          player.pos.addScaledVector(fwd, -SPEED);
        if (keys["KeyA"] || keys["ArrowLeft"])
          player.pos.addScaledVector(right, -SPEED);
        if (keys["KeyD"] || keys["ArrowRight"])
          player.pos.addScaledVector(right, SPEED);

        // Clamp to island
        const dist = Math.hypot(player.pos.x, player.pos.z);
        if (dist > ISLAND_R) {
          player.pos.x *= ISLAND_R / dist;
          player.pos.z *= ISLAND_R / dist;
        }

        // Walk bob
        player.bobT += BOB_SPEED * dt;
      }

      // Bob: vertical + tiny side sway
      const bobY = moving && locked ? Math.sin(player.bobT) * BOB_AMP : 0;
      const bobSide =
        moving && locked ? Math.sin(player.bobT * 0.5) * BOB_AMP * 0.4 : 0;

      // Smoothly return bob to 0 when stopped
      if (!moving) player.bobT *= 0.85;

      // Apply to camera
      euler.set(player.pitch, player.yaw, bobSide, "YXZ");
      camera.quaternion.setFromEuler(euler);
      camera.position.set(player.pos.x, EYE_H + bobY, player.pos.z);
    },
  };
}

export function handleResize(camera, renderer) {
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
