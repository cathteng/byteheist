import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './virus.gltf';

class Resistor extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'virus';
        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(2, 2, 2);
            this.add(gltf.scene);
        });
    }
}

export default Resistor;
