import * as THREE from "../node_modules/three/build/three.module.js";
import Flower from "../Components/Flower.js";
import Helpers from "../Utils/Helpers.js";

class Raycaster {
  constructor(camera, scene, objects, flowerSound) {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.isSpaceDown = false;

    const onPointerDown = (event) => {
      this.pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      this.raycaster.setFromCamera(this.pointer, camera);

      const intersects = this.raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        // Create a flower
        if (this.isSpaceDown) {
          if (!flowerSound.isPlaying) flowerSound.play();
          new Flower(
            { color: Helpers.getRandomFlowerColor() },
            { r: 0.3, widthSegments: 32, heightSegments: 16, color: 0xffa500 },
            { rTop: 0.3, rBottom: 0.3, height: 15, color: 0xb5d5b0 },
            scene,
            objects,
            intersect
          );
        }
      }
    };

    const onKeyDown = (e) => {
      switch (e.keyCode) {
        case 32:
          this.isSpaceDown = true;
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.keyCode) {
        case 32:
          this.isSpaceDown = false;
          break;
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  }
}

export default Raycaster;
