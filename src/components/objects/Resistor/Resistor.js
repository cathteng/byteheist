import { Group, MeshPhongMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
// import MODEL from './resistor.gltf';
import * as THREE from "three";

const SCALE = 50;
import MODEL from "./resistor-colored.gltf";
// >>>>>>> ac1f943fa38f3e7966b6b36df9447402b5cdbc12

class Resistor extends Group {
  constructor(position, angle, material) {
    // Call parent Group() constructor
    super();
    const loader = new GLTFLoader();
    this.material = material;
    this.origPosition = position;

    this.name = "resistor";
    loader.load(MODEL, (gltf) => {
      let obj = gltf.scene;
      obj.scale.set(SCALE, SCALE, SCALE);
      obj.rotateX(-Math.PI / 2);
      for (const child of obj.children[0].children) {
        const color = child.material.color;
        child.material = new MeshPhongMaterial({ color: color });
      }
      this.add(obj);
      this.position.set(position.x, position.y, position.z);
    });

    this.createBoxes(position, angle, material);
    this.rotateX(angle.x);
    this.rotateY(angle.y);
    this.rotateZ(angle.z);
  }

  createBoxes(position, angle, material) {
    // body
    let FACTOR = 1 / 50;
    let resistorWidth = FACTOR * SCALE * 7;
    let resistorHeight = FACTOR * SCALE * 2.5;
    let resistorDepth = FACTOR * SCALE * 2.6;
    let resistorBody = new CANNON.Body({
      shape: new CANNON.Box(
        new CANNON.Vec3(resistorWidth, resistorHeight, resistorDepth)
      ), // use this for a finite plane
      type: CANNON.Body.STATIC,
      material: material, //
      position: new THREE.Vector3(position.x, position.y + 3.5, position.z),
    });
    resistorBody.fixedRotation = true;
    this.body = resistorBody;
    this.body.quaternion.setFromEuler(angle.x, angle.y, angle.z);
    // arm
    // also at position.y + 3.5
    let armWidth = FACTOR * SCALE * 12;
    let armHeight = FACTOR * SCALE * 0.6;
    let armDepth = FACTOR * SCALE * 0.6;
    // debugger;
    let armBody = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(armWidth, armHeight, armDepth)), // use this for a finite plane
      type: CANNON.Body.STATIC,
      material: material, //
      position: new THREE.Vector3(position.x, position.y + 3.5, position.z),
    });
    this.arm = armBody;
    this.arm.quaternion.setFromEuler(angle.x, angle.y, angle.z);

    // leg1
    let legWidth = FACTOR * SCALE * 0.6;
    let legHeight = FACTOR * SCALE * 4.5;
    let legDepth = FACTOR * SCALE * 0.6;
    // debugger;
    let legAngleDecision = Math.round(angle.y / (Math.PI / 2)) % 2;
    let newLegPos1;
    let newLegPos2;
    if (legAngleDecision == 1) {
      newLegPos1 = new THREE.Vector3(
        position.x,
        position.y - 1.5,
        position.z + 12.5
      );
      newLegPos2 = new THREE.Vector3(
        position.x,
        position.y - 1.5,
        position.z - 12.5
      );
    } else {
      newLegPos1 = new THREE.Vector3(
        position.x + 12.5,
        position.y - 1.5,
        position.z
      );
      newLegPos2 = new THREE.Vector3(
        position.x - 12.5,
        position.y - 1.5,
        position.z
      );
    }
    let leg1Body = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(legWidth, legHeight, legDepth)), // use this for a finite plane
      type: CANNON.Body.STATIC,
      material: material, //
      position: newLegPos1,
    });
    this.leg1 = leg1Body;
    this.leg1.quaternion.setFromEuler(angle.x, angle.y, angle.z);
    // leg2
    let leg2Body = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(legWidth, legHeight, legDepth)), // use this for a finite plane
      type: CANNON.Body.STATIC,
      material: material, //
      position: newLegPos2,
    });
    this.leg2 = leg2Body;
    this.leg2.quaternion.setFromEuler(angle.x, angle.y, angle.z);

    // this.rotateX(angle.x);
    // this.rotateY(angle.y);
    // this.rotateZ(angle.z);
  }

  addBodies(world) {
    world.addBody(this.body);
    world.addBody(this.arm);
    world.addBody(this.leg1);
    world.addBody(this.leg2);
    // return world;
  }

  removeBoxes() {
    delete this.body;
    delete this.arm;
    delete this.leg1;
    delete this.leg2;
  }

  // vector3 of axis rotations
  doRotation(angle) {
    this.removeBoxes();
    this.createBoxes(this.origPosition, angle, this.material);
    this.rotateX(angle.x);
    this.rotateY(angle.y);
    this.rotateZ(angle.z);
    // this.body.quaternion.setFromEuler(angle.x, angle.y, angle.z);
  }
}

export default Resistor;
