import * as THREE from "../node_modules/three/build/three.module.js";
import Helpers from "../Utils/Helpers.js";

class Leaves {
  constructor(leaves, scene, x, y, z, setUUID, isSpecial) {
    this.geometryLeaves = new THREE.ConeGeometry(
      leaves.r,
      leaves.height,
      leaves.rSegments
    );
    this.materialLeaves = new THREE.MeshPhongMaterial({
      color: isSpecial ? 0xffff00  : Helpers.getRandomLeafColor(),
    });
    this.leaves = new THREE.Mesh(this.geometryLeaves, this.materialLeaves);
    this.leaves.castShadow = true;
    this.leaves.position.x = x;
    this.leaves.position.y = y;
    this.leaves.position.z = z;
    this.leaves.updateMatrix();
    this.leaves.matrixAutoUpdate = false;
    setUUID(this.leaves.uuid);
    scene.add(this.leaves);
  }
}

export default Leaves;
