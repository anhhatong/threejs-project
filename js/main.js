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

const objectsFloor = [];
const objectsTree = [];
let t = 0;
let scene, renderer, canvas, camera, controls, dome, hemLight;
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
  camera.position.y = Constants.camera.y;

  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color();

  // Create floor
  new Floor(Constants.floor, scene, objectsFloor);
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
  // Create raycaster for flower planting
  new Raycaster(camera, scene, objectsFloor);
  new RaycasterTree(camera, scene, objectsTree);
};

const lerpBackground = () => {
  t += 0.01;
  scene.background.copy(day).lerpHSL(duskdawn, 0.3 * Math.sin(t) + 0.5);
  // Create fog
  scene.fog = new THREE.FogExp2(scene.background, 0.0009);
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

  controls.controls.update();
  requestAnimationFrame(animate);
  render();
};

const render = () => {
  renderer.render(scene, camera);
};

init();
animate();
