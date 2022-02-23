import * as THREE from "../node_modules/three/build/three.module.js";
class Petal {
  constructor(petal, intersect, scene, dy, rX, rZ, objects) {
    const points = [];
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2), i));
    }
    this.geometryPetal = new THREE.LatheGeometry(points);
    this.materialPetal = new THREE.MeshPhongMaterial({
      color: petal.color,
      flatShading: true,
    });
    this.petal = new THREE.Mesh(this.geometryPetal, this.materialPetal);
    this.petal.position.copy(intersect.point).add(intersect.face.normal);
    this.petal.position.y += dy;
    this.petal.rotation.x = rX;
    this.petal.rotation.z = rZ;
    scene.add(this.petal);
    objects.push(this.petal);
  }
}

export default Petal;
