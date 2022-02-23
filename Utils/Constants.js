import * as THREE from "../node_modules/three/build/three.module.js";
import Textures from "../Textures/index.js";

const Constants = {
  floor: {
    width: 4000,
    height: 4000,
    color: 0x2e4756,
    isShadowVisible: true,
    rotateX: Math.PI / 2,
    texture: new THREE.TextureLoader().load(Textures.ground),
  },
  skySphere: {
    texture: new THREE.TextureLoader().load(Textures.nightsky),
    radius: 2000,
  },
  camera: {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 2000,
    z: 100,
    y: 10,
  },
  tree: {
    total: 600,
  },
  leaves: { r: 10, height: 60, rSegments: 32 },
  trunk: {
    rTop: 4,
    rBottom: 10,
    height: 100,
    rSegments: 6,
    heightSegments: 1,
  },
  controls: {
    zoomSpeed: 0.5,
    rotateSpeed: 0.5,
    minDistance: 5,
    maxDistance: 300,
    maxPolarAngle: Math.PI / 2,
    screenSpacePanning: false,
    enableDamping: true, // an animation loop is required when either damping or auto-rotation are enabled
    dampingFactor: 0.03,
    keyPanSpeed: 15
  },
};

export default Constants;