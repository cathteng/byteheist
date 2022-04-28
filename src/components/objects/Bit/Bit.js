import * as THREE from "three";
import * as APP from "../../../app.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './one.gltf';
import MODEL2 from './bit0.gltf'

class Bit {
    constructor(num, position) {
        this.counter = 0;
        this.position = position.clone();
        this.corrupted = false;
        this.origY = position.clone().y;
        this.mesh = new THREE.Group();

        // const bitCollectGeo = new THREE.SphereGeometry(1);
        const bitCollectGeo = new THREE.BoxGeometry(2, 2, 2);
        const bitCollectMat = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: true,
        });

        const loader = new GLTFLoader();

        if (num === 1){
            loader.load(MODEL, (gltf) => {;
            gltf.scene.scale.set(2, 2, 2);
            this.mesh = gltf.scene;
            this.mesh.position.copy(position);
            APP.scene.add(gltf.scene);
            });
        }
        else if (num === 0){
            loader.load(MODEL2, (gltf) => {;
            gltf.scene.scale.set(2, 2, 2);
            this.mesh = gltf.scene;
            this.mesh.position.copy(position);
            APP.scene.add(gltf.scene);
            });
        }
        
    }
    // like going viral
    handleCollisions(spherePosition) {
        let EPS = 3;
        if (this.corrupted) return 0;

        // decrease BASE to spin faster
        const BASE = 500;
        const factor = 2 * Math.PI / BASE;
        this.mesh.rotation.setFromVector3(new THREE.Vector3( 0, factor * this.counter, 0));

        // moving up and down
        const OSC_SPEED = 10; // higher is faster
        let amp = Math.sin(this.counter * factor * OSC_SPEED);
        const HEIGHT_CHANGE = 1;
        let change = amp * HEIGHT_CHANGE;
        // NOT this.position (do not change this.position pls)
        this.mesh.position.y = this.origY + change;

        this.counter = (this.counter+1) % BASE;

        let dist = Math.sqrt(
            (spherePosition.x - this.position.x) ** 2 +
            (spherePosition.y - this.position.y) ** 2 +
              (spherePosition.z - this.position.z) ** 2);
        if (dist < EPS) {
            this.mesh.visible = false;
            this.corrupted = true;
            return 1;
        }
        return 0;
    }
}

export default Bit;