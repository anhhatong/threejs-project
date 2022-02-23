import * as THREE from "../node_modules/three/build/three.module.js";
class SkySphere {
  constructor(skySphere, scene) {
    this.geometry = new THREE.SphereGeometry(skySphere.radius);
    this.material = new THREE.MeshBasicMaterial({
      map: skySphere.texture,
      side: THREE.BackSide,
    });
    this.skySphere = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.skySphere);
  }
}
export default SkySphere;
