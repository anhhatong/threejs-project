import * as THREE from "../node_modules/three/build/three.module.js";
import Textures from "../Textures/index.js";

class Ice {
  constructor(scene, floor, objectsFloor, texture, x, y, z) {
    const splinepts = [];
    splinepts.push(new THREE.Vector3(70, 20));
    splinepts.push(new THREE.Vector3(80, 90));
    splinepts.push(new THREE.Vector3(-30, 70));
    splinepts.push(new THREE.Vector3(0, 0));
  
    const splineShape = new THREE.Shape().moveTo(0, 0).splineThru(splinepts);
  
    const extrudeSettings = {
      depth: 50,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 700,
      bevelThickness: 1,
    };

    this.iceGeometry = new THREE.ExtrudeGeometry(splineShape, extrudeSettings);

    const loader2 = new THREE.TextureLoader();
    const iceTexture = loader2.load(Textures.water);
    iceTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    iceTexture.repeat.set(0.00008, 1);

    this.ice = new THREE.Mesh(
      this.iceGeometry,
      new THREE.MeshBasicMaterial({ map: iceTexture })
    );
    this.ice.position.set(x + 400, y, z + 850);
    this.ice.rotation.set(0, 0, 0);
    this.ice.scale.set(1, 1, 1);
    this.ice.rotation.x = -Math.PI / 2;
    scene.add(this.ice);

    const adjustObject = (o) => {
      const raycaster = new THREE.Raycaster();
      let castFrom = new THREE.Vector3();
      let castDirection = new THREE.Vector3(0, -1, 0);
      castFrom.copy(o.position); // get camera current position
      castFrom.y += 250;
      raycaster.set(castFrom, castDirection);
      // See if the ray from the camera into the world hits one of our meshes
      const intersects = raycaster.intersectObject(floor.floor);
      // Toggle rotation bool for meshes that we clicked
      if (intersects.length > 0) {
        o.position.set(0, 0, 0);
        o.lookAt(intersects[0].face.normal);
        o.position.copy(intersects[0].point);
      }
    };

    adjustObject(this.ice);
    objectsFloor.push(this.ice);
  }
}

export default Ice;
