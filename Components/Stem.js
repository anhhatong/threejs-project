import * as THREE from "../node_modules/three/build/three.module.js";
class Stem {
  constructor(stem, intersect, scene, objects) {
    this.geometryStem = new THREE.CylinderGeometry(
      stem.rTop,
      stem.rBottom,
      stem.height
    );
    this.materialStem = new THREE.MeshPhongMaterial({
      color: stem.color,
    });
    this.stem = new THREE.Mesh(this.geometryStem, this.materialStem);
    this.stem.position.copy(intersect.point).add(intersect.face.normal);

    

    scene.add(this.stem);
    objects.push(this.stem);
  }
}

export default Stem;
