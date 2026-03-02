export const rnd = (a, b) => Math.random() * (b - a) + a;
export const rndI = (a, b) => Math.floor(rnd(a, b));
export const pick = (arr) => arr[rndI(0, arr.length)];

export function mkMat(color, emissive = 0x000000, ei = 0) {
  return new THREE.MeshPhongMaterial({
    color,
    flatShading: true,
    emissive,
    emissiveIntensity: ei,
  });
}

export function toFlat(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.computeVertexNormals();
  return g;
}

export function mkMesh(geo, mat, shadow = true) {
  const m = new THREE.Mesh(toFlat(geo), mat);
  if (shadow) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  return m;
}
