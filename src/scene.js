export const Y = 0.0; // ground level

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1520);
  scene.fog = new THREE.FogExp2(0x0a1520, 0.012);
  return scene;
}

export function initCamera() {
  // FPS camera — position set each frame by controls
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.05,
    200,
  );
  camera.position.set(0, 1.65, 6);
  return camera;
}

export function initRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  return renderer;
}

export function initLights(scene) {
  scene.add(new THREE.AmbientLight(0x152238, 0.9));

  const moon = new THREE.DirectionalLight(0x3355aa, 0.8);
  moon.position.set(-12, 20, 8);
  moon.castShadow = true;
  moon.shadow.camera.left = moon.shadow.camera.bottom = -35;
  moon.shadow.camera.right = moon.shadow.camera.top = 35;
  moon.shadow.camera.far = 60;
  moon.shadow.mapSize.set(1024, 1024);
  scene.add(moon);

  const fireLight = new THREE.PointLight(0xff7722, 3.5, 18);
  fireLight.position.set(0, Y + 1.5, 0);
  fireLight.castShadow = true;
  fireLight.shadow.mapSize.set(512, 512);
  scene.add(fireLight);

  const fireLight2 = new THREE.PointLight(0xff4400, 2.0, 12);
  fireLight2.position.set(0, Y + 0.5, 0);
  scene.add(fireLight2);

  return { fireLight, fireLight2 };
}
