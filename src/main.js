import { initScene, initCamera, initRenderer, initLights } from "./scene.js";
import { buildIsland, buildSky } from "./world.js";
import { buildCampfire } from "./campfire.js";
import { buildTent } from "./tent.js";
import { placeTrees } from "./trees.js";
import { initControls, handleResize } from "./controls.js";

const scene = initScene();
const camera = initCamera();
const renderer = initRenderer();
const { fireLight, fireLight2 } = initLights(scene);

buildIsland(scene);
buildSky(scene, camera);
const flameGroup = buildCampfire(scene);
buildTent(scene);
placeTrees(scene);

const controls = initControls(renderer, camera);
handleResize(camera, renderer);

let last = performance.now();
let t = 0;

(function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min((now - last) / 1000, 0.05); // seconds, capped
  last = now;
  t += dt;

  controls.update(dt);

  // Fire flicker
  const flicker = 1.0 + Math.sin(t * 2.1) * 0.08 + Math.sin(t * 3.7) * 0.05;
  fireLight.intensity = 5.0 * flicker;
  fireLight2.intensity = 2.0 * flicker;

  // Flame breathe
  if (flameGroup) {
    flameGroup.children.forEach((c, i) => {
      c.scale.y =
        1.0 +
        Math.sin(t * 1.6 + i * 0.9) * 0.09 +
        Math.sin(t * 2.8 + i * 1.5) * 0.04;
      c.scale.x = c.scale.z = 1.0 + Math.sin(t * 1.2 + i * 1.1) * 0.05;
      c.rotation.y = Math.sin(t * 0.8 + i) * 0.12;
    });
  }

  renderer.render(scene, camera);
})();
