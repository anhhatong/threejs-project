import * as THREE from "../node_modules/three/build/three.module.js";
import Constants from "../Utils/Constants.js";
import { ImprovedNoise } from "../node_modules/three/examples/jsm/math/ImprovedNoise.js";
class Floor {
  constructor(floor, scene, objects, controls, camera) {
    this.geometry = new THREE.PlaneGeometry(floor.width, floor.height, 49, 49);
    this.geometry.rotateX(Math.PI / 2);
    this.camera = camera;
    this.controls = controls;

    const data = this.generateHeight(50, 50);

    // this.controls.target.y = data[ 25 + 25 * 50 ] + 50;
    // this.camera.position.y = controls.target.y + 500;
    // this.camera.position.x = 2000;
    // this.controls.update();

    const vertices = this.geometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10;
    }

    this.texture = new THREE.CanvasTexture(this.generateTexture(data, 50, 50));
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
    });

    this.floor = new THREE.Mesh(this.geometry, this.material);
    this.floor.position.y = -850;
    this.floor.receiveShadow = true;
    scene.add(this.floor);
    objects.push(this.floor);

    this.cursorGeometry = new THREE.CylinderGeometry(8, 8, 2);
    this.cursorGeometry.rotateX(Math.PI / 2);
    this.cursor = new THREE.Mesh(
      this.cursorGeometry,
      new THREE.MeshNormalMaterial()
    );
    scene.add(this.cursor);

    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    document.addEventListener("pointermove", this.onPointerMove);
  }

  onPointerMove = (event) => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // See if the ray from the camera into the world hits one of our meshes
    const intersects = this.raycaster.intersectObject(this.floor);
    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {
      this.cursor.position.set(0, 0, 0);
      this.cursor.lookAt(intersects[0].face.normal);

      this.cursor.position.copy(intersects[0].point);
    }
  };

  generateTexture(data, width, height) {
    // bake lighting into texture by drawing a canvas

    let context, image, imageData;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    // Floor color rgb(34, 40, 49)
    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
      const depthFactor = 0.5 + data[j] * 0.007; // color reflect depth of terrain
      imageData[i] = 34 * depthFactor;
      imageData[i + 1] = 40 * depthFactor;
      imageData[i + 2] = 49 * depthFactor;
    }

    context.putImageData(image, 0, 0);
    const canvasScaled = document.createElement("canvas");
    canvasScaled.width = width * 7;
    canvasScaled.height = height * 7;

    context = canvasScaled.getContext("2d");
    context.scale(7, 7);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
      const v = ~~(Math.random() * 5);

      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
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
