import * as THREE from "../node_modules/three/build/three.module.js";
class Floor {
  constructor(floor, scene, objects) {
    this.material = new THREE.MeshPhongMaterial({
      map: floor.texture,
      side: THREE.DoubleSide,
    });
    this.geometry = new THREE.PlaneGeometry(floor.width, floor.height);
    this.floor = new THREE.Mesh(this.geometry, this.material);
    this.floor.rotation.x = floor.rotateX;
    this.floor.receiveShadow = true;
    scene.add(this.floor);
    objects.push(this.floor);
  }
}
export default Floor;
