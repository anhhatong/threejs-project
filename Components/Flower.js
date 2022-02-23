import Petal from "./Petal.js";
import Stem from "./Stem.js";
import Base from "./Base.js";

class Flower {
  constructor(petal, base, stem, scene, objects, intersect) {
    this.base = new Base(base, intersect, scene, stem.height / 2, objects);
    this.stem = new Stem(stem, intersect, scene, objects);
    this.petalMid = new Petal(
      petal,
      intersect,
      scene,
      stem.height / 2,
      0,
      0,
      objects
    );
    this.petalLeft = new Petal(
      petal,
      intersect,
      scene,
      stem.height / 2,
      0,
      Math.PI / 8,
      objects
    );
    this.petalRight = new Petal(
      petal,
      intersect,
      scene,
      stem.height / 2,
      0,
      -Math.PI / 8,
      objects
    );
    this.petalFront = new Petal(
      petal,
      intersect,
      scene,
      stem.height / 2,
      Math.PI / 8,
      0,
      objects
    );
    this.petalBack = new Petal(
      petal,
      intersect,
      scene,
      stem.height / 2,
      -Math.PI / 8,
      0,
      objects
    );
  }
}
export default Flower;
