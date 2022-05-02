import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import MODEL from "./box.gltf";

class Box extends Group {
  constructor() {
    // Call parent Group() constructor
    super();

    // Load object
    const loader = new GLTFLoader();

    this.name = "box";
    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
    });
  }

  update(timeStamp) {
    if (this.state.bob) {
      // Bob back and forth
      this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
    }
    if (this.state.twirl > 0) {
      // Lazy implementation of twirl
      this.state.twirl -= Math.PI / 8;
      this.rotation.y += Math.PI / 8;
    }

    // Advance tween animations, if any exist
    TWEEN.update();
  }
}

export default Box;
