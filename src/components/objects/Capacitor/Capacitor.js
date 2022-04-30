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

        this.name = 'capacitor';

        loader.load(MODEL, (gltf) => {
            let cap = gltf.scene;
            cap.scale.set(SCALE, SCALE * 3, SCALE);
            cap.rotateX(-Math.PI / 2);
            this.add(cap);
            this.position.set(position.x, position.y, position.z);
            this.mesh = cap;
        });

        // srry for hard-coding. load happens asynchronously and idk how to
        // deal with that
        let topBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(3, 0.1, 3)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: new THREE.Vector3(position.x, position.y + 5, position.z),
        });
        this.topBody = topBody;

        let side1 = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(3, 4, 0.01)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: new THREE.Vector3(position.x, position.y + 1, position.z + 3),
        });
        this.side1 = side1;

        let side2 = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(3, 4, 0.01)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: new THREE.Vector3(position.x, position.y + 1, position.z - 3),
        });
        this.side2 = side2;

        let side3 = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.01, 4, 3)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: new THREE.Vector3(position.x + 3, position.y + 1, position.z),
        });
        this.side3 = side3;

        let side4 = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.01, 4, 3)), // use this for a finite plane
            type: CANNON.Body.STATIC,
            material: material, //
            position: new THREE.Vector3(position.x - 3, position.y + 1, position.z),
        });
        this.side4 = side4;
    }
    addBodies(world) {
        world.addBody(this.topBody);
        world.addBody(this.side1);
        world.addBody(this.side2);
        world.addBody(this.side3);
        world.addBody(this.side4);
        return world;
    }
}

export default Capacitor;
