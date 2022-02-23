import * as THREE from "../node_modules/three/build/three.module.js";
import Helpers from "../Utils/Helpers.js";
class Trunk {
  constructor(trunk, scene, x, z) {
    this.geometryTrunk = new THREE.CylinderGeometry(
      trunk.rTop,
      trunk.rBottom,
      trunk.height,
      trunk.rSegments,
      trunk.heightSegments
    );
    this.materialTrunk = new THREE.MeshPhongMaterial({
      color: Helpers.getRandomBarkColor(),
      flatShading: true,
    });
    this.trunk = new THREE.Mesh(this.geometryTrunk, this.materialTrunk);
    this.trunk.castShadow = true;
    this.trunk.position.x = x;
    this.trunk.position.z = z;
    this.trunk.updateMatrix();
    this.trunk.matrixAutoUpdate = false;
    scene.add(this.trunk);
  }
}
export default Trunk;
