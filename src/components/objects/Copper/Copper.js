import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from 'three';
import * as APP from "../../../app.js";

class Copper extends Group {
    constructor(position, depth, width, height) {
        // Call parent Group() constructor
        super();

        // creates a mesh that doesn't have a collider
        const geom = new THREE.BoxGeometry(width, height, depth);
        const mat = new THREE.MeshBasicMaterial({color: 0xB87333});
        const mesh = new THREE.Mesh(geom, mat);
        // scene.add(mesh);
        // this.position.set(position.x, position.y, position.z);
        this.mesh = mesh;
        this.mesh.position.set(position.x, position.y, position.z);

        let boundingBox = {
            min: new THREE.Vector3(position.x - (width / 2),
                                    position.y - (height / 2),
                                    position.z - (depth / 2)),
            max: new THREE.Vector3(position.x + (width / 2),
                                    position.y + (height / 2),
                                    position.z + (depth / 2)),
        };
        
        this.boundingBox = boundingBox;
    }

    handleCollisions(spherePos) {
        const FAIL_HEIGHT = 1;
        if (!(this.boundingBox.min.x < spherePos.x && 
                spherePos.x < this.boundingBox.max.x))
            return 0;
        if (!(this.boundingBox.min.z < spherePos.z && 
                spherePos.z < this.boundingBox.max.z))
            return 0;
        if (!(this.boundingBox.min.y < spherePos.y && 
                spherePos.y < this.boundingBox.max.z + FAIL_HEIGHT))
            return 0;
        // gameover state
        return 1;
    }
}

export default Copper;
