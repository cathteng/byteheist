import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from "cannon-es";
import MODEL from './resistor.gltf';

class Resistor extends Group {
    constructor(position, material) {
        // Call parent Group() constructor
        super();
        const loader = new GLTFLoader();
        const SCALE = 50;

        this.name = 'resistor';
        loader.load(MODEL, (gltf) => {
            let obj = gltf.scene;
            obj.scale.set(SCALE, SCALE, SCALE);
            obj.rotateX(-Math.PI / 2);
            this.add(obj);
            this.position.set(position.x, position.y, position.z);
        });
        let FACTOR = 1 / 50;
        let resistorWidth = FACTOR * SCALE * 13;
        let resistorHeight = FACTOR * SCALE * 6;
        let resistorDepth = FACTOR * SCALE * 2.6;
        let resistorBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(resistorWidth, 
              resistorHeight, resistorDepth)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: position
          });
        resistorBody.fixedRotation = true;
        this.body = resistorBody;
    }

    // vector3 of axis rotations
    doRotation(angle) {
        this.rotateX(angle.x);
        this.rotateY(angle.y);
        this.rotateZ(angle.z);
        this.body.quaternion.setFromEuler(angle.x, angle.y, angle.z);
    }
}

export default Resistor;
