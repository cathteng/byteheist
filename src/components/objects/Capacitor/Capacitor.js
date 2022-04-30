import { Group } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from "cannon-es";
import MODEL from './cap.gltf';
import { scene } from '../../../app';

class Capacitor extends Group {
    constructor(position, material) {
        // Call parent Group() constructor
        super();
        const loader = new GLTFLoader();
        const SCALE = 20;
        this.topBody = 1;

        this.name = 'cap';

        loader.load(MODEL, (gltf) => {
            let cap = gltf.scene;
            cap.scale.set(SCALE, SCALE * 3, SCALE);
            cap.rotateX(-Math.PI / 2);
            this.add(cap);
            this.position.set(position.x, position.y, position.z);
            this.mesh = cap;
        });
        let body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(3, 5, 3)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: new THREE.Vector3(position.x, position.y, position.z),
        });
        this.body = body;
    }
}

export default Capacitor;
