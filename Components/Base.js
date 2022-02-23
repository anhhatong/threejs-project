import * as THREE from "../node_modules/three/build/three.module.js";
class Base {
  constructor(base, intersect, scene, dy, objects) {
    this.geometryBase = new THREE.SphereGeometry(
      base.r,
      base.widthSegments,
      base.heightSegments
    );
    this.materialBase = new THREE.MeshPhongMaterial({
      color: base.color,
      flatShading: true,
    });
    this.base = new THREE.Mesh(this.geometryBase, this.materialBase);
    this.base.position.copy(intersect.point).add(intersect.face.normal);
    this.base.position.y += dy;
    scene.add(this.base);
    objects.push(this.base);
  }
}

export default Base;
