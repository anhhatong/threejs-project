import * as THREE from "../node_modules/three/build/three.module.js";
import Flower from "../Components/Flower.js";
import Helpers from "../Utils/Helpers.js";
import Constants from "../Utils/Constants.js";
import Textures from "../Textures/index.js";

class Raycaster {
  constructor(camera, scene, objects, flowerSound, iceSound, waterSound) {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.isSpaceDown = false;

    const playSound = (sound) => {
      if (!sound.isPlaying) sound.play();
    };

    const onPointerDown = (event) => {
      this.pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      this.raycaster.setFromCamera(this.pointer, camera);

      const intersects = this.raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const uid = intersect.object.uuid;
        if (this.isSpaceDown) {
          switch (uid) {
            case Constants.uids.water:
              playSound(waterSound);
              const shape = new THREE.Mesh(
                new THREE.TorusGeometry(10, 4, 8, 30),
                new THREE.MeshPhongMaterial({ color: 0xffd800 })
              );
              const head = new THREE.Mesh(
                new THREE.SphereGeometry(5, 32),
                new THREE.MeshPhongMaterial({ color: 0xffe138 })
              );
              const mouth = new THREE.Mesh(
                new THREE.ConeGeometry(2, 2, 3),
                new THREE.MeshBasicMaterial({ color: 0xfb743e })
              );
              shape.position.copy(intersect.point).add(intersect.face.normal);
              shape.rotation.x = Math.PI / 2;
              shape.position.y += 2;
              head.position.y = shape.position.y + 5 + 2;
              head.position.x = shape.position.x + 5 + 2;
              head.position.z = shape.position.z + 5 + 2;
              mouth.position.y = head.position.y;
              mouth.position.x = head.position.x + 4;
              mouth.position.z = head.position.z + 5;
              scene.add(head);
              scene.add(shape);
              scene.add(mouth);
              break;
            case Constants.uids.ice:
              playSound(iceSound);
              const ice = new THREE.Mesh(
                new THREE.BoxGeometry(
                  Math.random() * 20 + 10,
                  Math.random() * 20 + 10,
                  Math.random() * 20 + 20
                ),
                new THREE.MeshPhysicalMaterial({
                  roughness: Math.random() * 1 - 0.3,
                  transmission: 1,
                  thickness: 1,
                })
              );
              ice.position.copy(intersect.point).add(intersect.face.normal);
              ice.rotation.x = Math.PI / 2;
              ice.position.y += 2;
              scene.add(ice);
              break;
            case Constants.uids.lava1:
              const mineralGeo1 = new THREE.IcosahedronGeometry(20);
              const mineral1 = new THREE.Mesh(
                mineralGeo1,
                new THREE.MeshPhysicalMaterial({
                  color: 0xd39c43,
                  roughness: 0.5,
                  transmission: 1,
                  thickness: 0,
                  metalness: Math.random() * 1,
                  reflectivity: 1,
                  clearcoat: 1,
                })
              );
              mineral1.position.copy(intersect.point).add(intersect.face.normal);
              scene.add(mineral1);
              break;
            case Constants.uids.lava2:
              const mineralGeo2 = new THREE.IcosahedronGeometry(20);
              const mineral2 = new THREE.Mesh(
                mineralGeo2,
                new THREE.MeshPhysicalMaterial({
                  color: 0x416656,
                  roughness: 0.5,
                  transmission: 1,
                  thickness: 0,
                  metalness: Math.random() * 1,
                  reflectivity: 1,
                  clearcoat: 1,
                })
              );
              mineral2.position.copy(intersect.point).add(intersect.face.normal);
              scene.add(mineral2);
              break;
            default:
              playSound(flowerSound);
              new Flower(
                { color: Helpers.getRandomFlowerColor() },
                {
                  r: 0.3,
                  widthSegments: 32,
                  heightSegments: 16,
                  color: 0xffa500,
                },
                { rTop: 0.3, rBottom: 0.3, height: 15, color: 0xb5d5b0 },
                scene,
                objects,
                intersect
              );
          }
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
