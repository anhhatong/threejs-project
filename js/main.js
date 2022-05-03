import * as THREE from "../node_modules/three/build/three.module.js";

import Controls from "../Components/Controls.js";
import Floor from "../Components/Floor.js";
import Raycaster from "../Components/Raycaster.js";
import Tree from "../Components/Tree.js";
import Constants from "../Utils/Constants.js";
import SkySphere from "../Components/SkySphere.js";
import DirectLight from "../Components/DirectLight.js";
import RaycasterTree from "../Components/RaycasterTree.js";
import Helpers from "../Utils/Helpers.js";
import Textures from "../Textures/index.js";

const objectsFloor = [];
const objectsTree = [];
let t = 0;
let scene,
  renderer,
  canvas,
  camera,
  controls,
  dome,
  hemLight,
  floor,
  music,
  windSound,
  flowerSound,
  pondGeometry,
  pond,
  texture,
  iceGeometry,
  ice,
  iceSound,
  waterSound,
  textureLava,
  iceTexture;
const day = new THREE.Color(0x2b2f77);
const duskdawn = new THREE.Color(0x070b34);
const nightSkyColor = 0x855988;
const nightSkyColorPurple = 0x483475;
const moonColor = 0xc2c5cc;

const init = () => {
  canvas = document.querySelector("#canvas");
  // Use WebGLRenderer to build 3D on canvas
  renderer = new THREE.WebGLRenderer({ canvas });
  document.body.appendChild(renderer.domElement);
  // Enable shadow casting
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // Create camera
  camera = new THREE.PerspectiveCamera(
    Constants.camera.fov,
    Constants.camera.aspect,
    Constants.camera.near,
    Constants.camera.far
  );
  camera.position.z = Constants.camera.z;

  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#DAD9D7");

  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  music = new THREE.Audio(listener);
  windSound = new THREE.Audio(listener);
  flowerSound = new THREE.Audio(listener);
  iceSound = new THREE.Audio(listener);
  waterSound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("../music.mp3", function (buffer) {
    music.setBuffer(buffer);
    music.setLoop(true);
    music.setVolume(0.2);
  });
  audioLoader.load("../wind.mp3", function (buffer) {
    windSound.setBuffer(buffer);
    windSound.setLoop(true);
    windSound.setVolume(0.8);
  });
  audioLoader.load("../plant-flower.wav", function (buffer) {
    flowerSound.setBuffer(buffer);
    flowerSound.setLoop(false);
    flowerSound.setVolume(0.5);
  });
  audioLoader.load("../ice.wav", function (buffer) {
    iceSound.setBuffer(buffer);
    iceSound.setLoop(false);
    iceSound.setVolume(0.5);
  });
  audioLoader.load("../water.wav", function (buffer) {
    waterSound.setBuffer(buffer);
    waterSound.setLoop(false);
    waterSound.setVolume(0.5);
  });

  // Create sky
  dome = new SkySphere(Constants.skySphere, scene);
  // Create trees
  for (let i = 0; i < Constants.tree.total; i++) {
    const rand = Helpers.pickRandomTree();
    const isSpecial = rand === 1;
    const tree = new Tree(Constants.leaves, Constants.trunk, scene, isSpecial);
    isSpecial && objectsTree.push(tree);
  }

  // Create direct light sources
  new DirectLight(
    scene,
    nightSkyColorPurple,
    -Constants.floor.width / 2,
    -Constants.floor.width / 2,
    Constants.floor.width / 2
  );
  new DirectLight(
    scene,
    nightSkyColor,
    Constants.floor.width / 2,
    -Constants.floor.width / 2,
    -Constants.floor.width / 2
  );
  new DirectLight(
    scene,
    moonColor,
    Constants.floor.width / 2,
    -Constants.floor.width / 2,
    Constants.floor.width / 2
  );

  // Create hemis light
  hemLight = new THREE.HemisphereLight(moonColor, 0x000000, 0.1);
  scene.add(hemLight);

  // Create controls
  controls = new Controls(camera, Constants.controls);

  // Create floor
  floor = new Floor(
    Constants.floor,
    scene,
    objectsFloor,
    controls.controls,
    camera
  );

  // Create raycaster for flower planting
  new Raycaster(camera, scene, objectsFloor, flowerSound, iceSound, waterSound);
  new RaycasterTree(camera, scene, objectsTree);

  // document.addEventListener("mousedown", playSound);

  const loader = new THREE.TextureLoader();
  texture = loader.load(Textures.water);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(45, 45);
  // it's necessary to apply these settings in order to correctly display the texture on a shape geometry

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

  addShape(
    splineShape,
    texture,
    extrudeSettings,
    0xd4f1f9,
    -50,
    -100,
    0,
    0,
    0,
    0,
    1
  );

  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 500 + 5, (i - 5) * 60));
  }
  const geometry = new THREE.LatheGeometry(points);

  const loaderLava = new THREE.TextureLoader();
  textureLava = loaderLava.load(Textures.lava);
  textureLava.wrapS = texture.wrapT = THREE.RepeatWrapping;
  textureLava.repeat.set(1, 1);

  const material = new THREE.MeshBasicMaterial({
    map: textureLava,
    side: THREE.DoubleSide,
  });
  const lathe = new THREE.Mesh(geometry, material);
  lathe.rotateX(Math.PI);
  lathe.translateZ(-1200);
  lathe.translateY(-150);
  scene.add(lathe);
  objectsFloor.push(lathe);

  const lavaGeometry = new THREE.SphereGeometry(
    1000,
    32,
    16,
    200,
    Math.PI * 2,
    0,
    Math.PI * 2
  );

  const lava = new THREE.Mesh(
    lavaGeometry,
    new THREE.MeshPhysicalMaterial({
      color: 0xff2500,
      roughness: 0.3,
      transmission: 1,
      thickness: 0,
    })
  );
  lava.scale.set(1, 1, 1);
  lava.rotation.x = -Math.PI / 2;
  lava.position.z += 1200;
  lava.position.y -= 750;
  scene.add(lava);
  objectsFloor.push(lava);

  console.log(lava, lathe);
};

const addShape = (
  shape,
  texture,
  extrudeSettings,
  color,
  x,
  y,
  z,
  rx,
  ry,
  rz,
  s
) => {
  // extruded shape

  iceGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  pondGeometry = new THREE.SphereGeometry(
    1500,
    32,
    16,
    200,
    Math.PI * 2,
    0,
    Math.PI * 2
  );

  pond = new THREE.Mesh(
    pondGeometry,
    new THREE.MeshBasicMaterial({ map: texture })
  );
  pond.position.set(x, y, z - 75);
  pond.scale.set(s, s, s);
  pond.rotation.x = -Math.PI / 2;
  pond.position.y -= 1390;
  scene.add(pond);

  const loader2 = new THREE.TextureLoader();
  iceTexture = loader2.load(Textures.water);
  iceTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  iceTexture.repeat.set(0.00008, 1);

  ice = new THREE.Mesh(
    iceGeometry,
    new THREE.MeshBasicMaterial({ map: iceTexture })
  );
  ice.position.set(x + 400, y, z + 850);
  ice.rotation.set(rx, ry, rz);
  ice.scale.set(s, s, s);
  ice.rotation.x = -Math.PI / 2;
  scene.add(ice);
  adjustObject(ice);

  objectsFloor.push(pond);
  objectsFloor.push(ice);
};

const playSound = () => {
  if (!music.isPlaying) music.play();
  if (!windSound.isPlaying) windSound.play();
};

const adjustCamera = () => {
  let castFrom = new THREE.Vector3();
  // Vector to cast from camera down to floor
  let castDirection = new THREE.Vector3(0, -1, 0);
  let raycaster = new THREE.Raycaster(camera.position);
  castFrom.copy(camera.position); // get camera current position
  castFrom.y += 1000;
  raycaster.set(castFrom, castDirection);
  let intersections = raycaster.intersectObjects(objectsFloor);
  if (intersections.length > 0) {
    // Elevate camera x unit from the floor
    camera.position.y = intersections[0].point.y + 20;
  }

  camera.updateProjectionMatrix();
};

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

const lerpBackground = () => {
  t += 0.02;
  // scene.background.copy(day).lerpHSL(duskdawn, 0.3 * Math.sin(t) + 0.5);
  dome.outerSphere.material.color
    .copy(day)
    .lerpHSL(duskdawn, 0.3 * Math.sin(t) + 0.5);
  // Create fog
  scene.fog = new THREE.FogExp2(dome.outerSphere.material.color, 0.0009);
};

const rotateDome = (time) => {
  time *= 0.001; // convert time to seconds
  const speed = 0.05;
  dome.skySphere.rotation.x = speed * time;
};

// For responsive purpose: check if it is resized
const resizeRendererToDisplaySize = function (renderer) {
  const canvas = renderer.domElement;
  // Get devicePixelRation to reduce pixelated edges
  // Because most devices keep pixel size the same regardless of window size
  const pixelRatio = window.devicePixelRatio;
  // Canvas dimension scales up by pixel ratio as window dimenstion increases
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  // If canvas dimenstion is different from the current dimestion of the window => resize
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

const animate = (time) => {
  // Only update camera aspect if resized
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    // Also change camera aspect
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  rotateDome(time);
  lerpBackground();
  adjustCamera();
  // adjustWater(pond);
  // dynamic water surface
  texture.offset.y += 0.0005;

  controls.controls.update();
  requestAnimationFrame(animate);
  render();
};

const render = () => {
  renderer.render(scene, camera);
};

init();
animate();
