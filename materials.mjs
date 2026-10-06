// Retain Three.js's scalar/array material shape. Arrays require geometry groups.
export function materialList(mesh) {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}
export function cloneMeshMaterials(mesh) {
  mesh.material = Array.isArray(mesh.material)
    ? mesh.material.map(material => material.clone())
    : mesh.material.clone();
  return materialList(mesh);
}
