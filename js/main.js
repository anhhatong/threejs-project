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
import Ice from "../Components/Ice.js";
import Pond from "../Components/Pond.js";
import Lava from "../Components/Lava.js";

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
  waterTexture,
  iceSound,
  waterSound,
  mineralSound,
  mineral2Sound;
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
  mineralSound = new THREE.Audio(listener);
  mineral2Sound = new THREE.Audio(listener);

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
    flowerSound.setVolume(1);
  });
  audioLoader.load("../ice.wav", function (buffer) {
    iceSound.setBuffer(buffer);
    iceSound.setLoop(false);
    iceSound.setVolume(1);
  });
  audioLoader.load("../water.wav", function (buffer) {
    waterSound.setBuffer(buffer);
    waterSound.setLoop(false);
    waterSound.setVolume(1);
  });
  audioLoader.load("../mineral.wav", function (buffer) {
    mineralSound.setBuffer(buffer);
    mineralSound.setLoop(false);
    mineralSound.setVolume(1);
  });
  audioLoader.load("../mineral2.wav", function (buffer) {
    mineral2Sound.setBuffer(buffer);
    mineral2Sound.setLoop(false);
    mineral2Sound.setVolume(1);
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
  new Raycaster(
    camera,
    scene,
    objectsFloor,
    flowerSound,
    iceSound,
    waterSound,
    mineralSound,
    mineral2Sound
  );

  // Create raycaster for trees
  new RaycasterTree(camera, scene, objectsTree);

  // Water texture loader to generate texture used for both pond and ice
  const loader = new THREE.TextureLoader();
  waterTexture = loader.load(Textures.water);
  waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
  waterTexture.repeat.set(45, 45);

  // Create ice
  new Ice(scene, floor, objectsFloor, waterTexture, -50, -100, 0);
  // Create pond
  new Pond(scene, objectsFloor, waterTexture, -50, -100, 0);
  // Create mountain of lava and lava
  new Lava(scene, objectsFloor);

  document.addEventListener("mousedown", playSound);
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
    // Elevate camera 20 unit from the floor
    camera.position.y = intersections[0].point.y + 20;
  }

  camera.updateProjectionMatrix();
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

  // dynamic water surface
  waterTexture.offset.y += 0.0005;

  controls.controls.update();
  requestAnimationFrame(animate);
  render();
};

const render = () => {
  renderer.render(scene, camera);
};

init();
animate();
