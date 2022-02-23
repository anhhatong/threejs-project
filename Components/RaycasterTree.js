import * as THREE from "../node_modules/three/build/three.module.js";
import Flower from "../Components/Flower.js";
import Helpers from "../Utils/Helpers.js";

class RaycasterTree {
  constructor(camera, scene, objects) {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.isSpaceDown = false;

    const onPointerDown = (event) => {
      this.pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      this.raycaster.setFromCamera(this.pointer, camera);

      const threeObjects = objects.map((o) => o.leaves.leaves);
      const intersects = this.raycaster.intersectObjects(threeObjects, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];

        // Select special tree
        if (this.isSpaceDown) {
          objects = objects.filter((o) => {
            if (o.uuid === intersect.object.uuid) o.reset();
            else return o;
          });
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

export default RaycasterTree;
