import * as THREE from "../node_modules/three/build/three.module.js";
import Constants from "../Utils/Constants.js";
import { ImprovedNoise } from "../node_modules/three/examples/jsm/math/ImprovedNoise.js";
class Floor {
  constructor(floor, scene, objects) {
    this.material = new THREE.MeshPhongMaterial({
      map: floor.texture,
      side: THREE.DoubleSide,
    });
    this.geometry = new THREE.PlaneGeometry(floor.width, floor.height, 51, 51);
    this.geometry.rotateX(Math.PI/2);

    const data = this.generateHeight(50, 50);
    const vertices = this.geometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10;
    }
    // this.geometry.rotateX(Math.PI/2);
    this.floor = new THREE.Mesh(this.geometry, this.material);
    this.floor.position.y = -1000
    // this.floor.rotation.x = floor.rotateX;
    // this.floor.receiveShadow = true;
    scene.add(this.floor);
    objects.push(this.floor);
  }

  generateHeight(width, height) {
    let seed = Math.PI / 4;
    window.Math.random = function () {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const size = width * height,
      data = new Uint8Array(size);
    const perlin = new ImprovedNoise(),
      z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width,
          y = ~~(i / width);
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 5;
    }

    return data;
  }
}
export default Floor;
