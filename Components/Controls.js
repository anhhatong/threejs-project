import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

class Controls {
  constructor(camera, controls) {
    this.controls = new OrbitControls(camera, document.body);
    this.controls.target.set(0, 0, 0);
    this.controls.zoomSpeed = controls.zoomSpeed;
    this.controls.rotateSpeed = controls.rotateSpeed;
    this.controls.minDistance = controls.minDistance;
    this.controls.maxDistance = controls.maxDistance;
    this.controls.maxPolarAngle = controls.maxPolarAngle;
    this.controls.screenSpacePanning = controls.screenSpacePanning;
    // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.enableDamping = controls.enableDamping;
    this.controls.dampingFactor = controls.dampingFactor;
    this.controls.keyPanSpeed = controls.keyPanSpeed;
    this.controls.listenToKeyEvents(window);
  }
}

export default Controls;
