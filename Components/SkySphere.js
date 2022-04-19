import * as THREE from "../node_modules/three/build/three.module.js";
class SkySphere {
  constructor(skySphere, scene) {
    this.geometry = new THREE.SphereGeometry(skySphere.radius);
    this.material = new THREE.MeshBasicMaterial({
      map: skySphere.texture,
      side: THREE.BackSide,
    });
    this.material.transparent = true;
    this.material.opacity = 0.5;
    this.skySphere = new THREE.Mesh(this.geometry, this.material);

    this.outerGeometry = new THREE.SphereGeometry(skySphere.radius + 20);
    this.outerMaterial = new THREE.MeshBasicMaterial({
      color: "#000",
      side: THREE.BackSide,
    });
    this.outerSphere = new THREE.Mesh(this.outerGeometry, this.outerMaterial);
    scene.add(this.skySphere);
    scene.add(this.outerSphere);
  }
}
export default SkySphere;
