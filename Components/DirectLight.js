import * as THREE from "../node_modules/three/build/three.module.js";

class DirectLight {
  constructor(scene, color, x, y, z) {
    this.dirLight = new THREE.DirectionalLight(color, 1);
    this.dirLight.position.set(x, y, z);
    scene.add(this.dirLight);
  }
}
export default DirectLight;
