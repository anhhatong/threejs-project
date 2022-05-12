import * as THREE from "../node_modules/three/build/three.module.js";
import Textures from "../Textures/index.js";

class Lava {
  constructor(scene, objectsFloor) {
    /**
     * lava mountain
     */
    const points = [];
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 500 + 5, (i - 5) * 60));
    }
    this.geometry = new THREE.LatheGeometry(points);

    const loaderLava = new THREE.TextureLoader();
    const textureLava = loaderLava.load(Textures.lava);
    textureLava.wrapS = textureLava.wrapT = THREE.RepeatWrapping;
    textureLava.repeat.set(1, 1);

    this.material = new THREE.MeshBasicMaterial({
      map: textureLava,
      side: THREE.DoubleSide,
    });
    this.lathe = new THREE.Mesh(this.geometry, this.material);
    this.lathe.rotateX(Math.PI);
    this.lathe.translateZ(-1200);
    this.lathe.translateY(-150);
    scene.add(this.lathe);
    objectsFloor.push(this.lathe);

    /**
     * liquid lava
     */
    this.lavaGeometry = new THREE.SphereGeometry(
      1000,
      32,
      16,
      200,
      Math.PI * 2,
      0,
      Math.PI * 2
    );

    this.lava = new THREE.Mesh(
      this.lavaGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0xff2500,
        roughness: 0.3,
        transmission: 1,
        thickness: 0,
      })
    );
    this.lava.scale.set(1, 1, 1);
    this.lava.rotation.x = -Math.PI / 2;
    this.lava.position.z += 1200;
    this.lava.position.y -= 750;
    scene.add(this.lava);
    objectsFloor.push(this.lava);
  }
}

export default Lava;
