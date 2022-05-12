import * as THREE from "../node_modules/three/build/three.module.js";

class Pond {
  constructor(scene, objectsFloor, texture, x, y, z) {
    this.pondGeometry = new THREE.SphereGeometry(
      1500,
      32,
      16,
      200,
      Math.PI * 2,
      0,
      Math.PI * 2
    );

    this.pond = new THREE.Mesh(
      this.pondGeometry,
      new THREE.MeshBasicMaterial({ map: texture })
    );
    this.pond.position.set(x, y, z - 75);
    this.pond.scale.set(1, 1, 1);
    this.pond.rotation.x = -Math.PI / 2;
    this.pond.position.y -= 1390;
    scene.add(this.pond);
    objectsFloor.push(this.pond);
  }
}

export default Pond;
