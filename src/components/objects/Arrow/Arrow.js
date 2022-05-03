import * as THREE from "three";
import * as APP from "../../../app.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

class Arrow {
  constructor(position) {
    this.counter = 0;
    this.position = position.clone();
    this.origY = position.clone().y;
    this.mesh = new THREE.Group();

    const loader = new OBJLoader();

    // https://clara.io/view/b8a8fb8d-cfe7-4e5d-a219-e26f862feb42
    loader.load("./src/components/objects/Arrow/arrow.obj", (object) => {
      this.mesh = object;
      this.mesh.scale.set(5, 5, 5);
      this.mesh.position.copy(position);
    });
  }
  // like going viral
  bob() {
    const BASE = 500;
    const factor = (2 * Math.PI) / BASE;
    // moving up and down
    const OSC_SPEED = 5; // higher is faster
    let amp = Math.sin(this.counter * factor * OSC_SPEED);
    const HEIGHT_CHANGE = 2;
    let change = amp * HEIGHT_CHANGE;
    // NOT this.position (do not change this.position pls)
    this.mesh.position.y = this.origY + change;
    this.counter = (this.counter + 1) % BASE;
  }
}

export default Arrow;
