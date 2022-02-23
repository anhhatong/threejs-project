import Leaves from "./Leaves.js";
import Trunk from "./Trunk.js";

import * as THREE from "../node_modules/three/build/three.module.js";
import Helpers from "../Utils/Helpers.js";

class Tree {
  constructor(leaves, trunk, scene, isSpecial) {
    this.isSpecial = isSpecial;
    this.uuid = null;
    this.setUUID = (uuid) => this.uuid = uuid;

    const randX = Math.random() * 2200 - 800;
    const randZ = Math.random() * 2200 - 800;
    this.leaves = new Leaves(
      leaves,
      scene,
      randX,
      trunk.height - trunk.height / 4,
      randZ,
      this.setUUID,
      this.isSpecial
    );
    this.trunk = new Trunk(trunk, scene, randX, randZ);
  }

  reset() {
    this.isSpecial = false;
    this.leaves.leaves.material.color = new THREE.Color(
      Helpers.getRandomLeafColor()
    );
  }
}

export default Tree;
