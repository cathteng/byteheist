import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import * as THREE from "three";
import * as APP from "../../../app.js";

class Copper extends Group {
  constructor(position, depth, width, height) {
    // Call parent Group() constructor
    super();

    // creates a mesh that doesn't have a collider
    const geom = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshBasicMaterial({ color: 0xb87333 });
    const mesh = new THREE.Mesh(geom, mat);
    this.mesh = mesh;
    this.mesh.position.set(position.x, position.y, position.z);

    let boundingBox = {
      min: new THREE.Vector3(
        position.x - width / 2,
        position.y - height / 2,
        position.z - depth / 2
      ),
      max: new THREE.Vector3(
        position.x + width / 2,
        position.y + height / 2,
        position.z + depth / 2
      ),
    };

    this.boundingBox = boundingBox;
  }

  handleCollisions(spherePos) {
    const FAIL_HEIGHT = 2;
    const FAIL_FLAT = 1.5;
    if (
      !(
        this.boundingBox.min.x - FAIL_FLAT < spherePos.x &&
        spherePos.x < this.boundingBox.max.x + FAIL_FLAT
      )
    )
      return 0;
    if (
      !(
        this.boundingBox.min.z - FAIL_FLAT < spherePos.z &&
        spherePos.z < this.boundingBox.max.z + FAIL_FLAT
      )
    )
      return 0;
    if (
      !(
        this.boundingBox.min.y < spherePos.y &&
        spherePos.y < this.boundingBox.max.y + FAIL_HEIGHT
      )
    )
      return 0;
    // gameover state
    return 1;
  }
}

export default Copper;
