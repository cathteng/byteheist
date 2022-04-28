import * as THREE from "three";
import * as CANNON from "cannon";
import * as APP from "../../app.js";

class Bit {
    constructor(position) {
        this.counter = 0;
        this.position = position.clone();
        this.corrupted = false;
        this.origY = position.clone().y;

        // const bitCollectGeo = new THREE.SphereGeometry(1);
        const bitCollectGeo = new THREE.BoxGeometry(2, 2, 2);
        const bitCollectMat = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: true,
        });
        const bitCollectMesh = new THREE.Mesh(bitCollectGeo, bitCollectMat);
        bitCollectMesh.position.copy(position);
        this.mesh = bitCollectMesh;
        APP.scene.add(bitCollectMesh);
    }
    // like going viral
    handleCollisions(spherePosition) {
        let EPS = 3;
        if (this.corrupted) return;

        // decrease BASE to spin faster
        const BASE = 250;
        const factor = 2 * Math.PI / BASE;
        this.mesh.rotation.setFromVector3(new THREE.Vector3( 0, factor * this.counter, 0));

        // moving up and down
        const OSC_SPEED = 5; // higher is faster
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
            APP.bitsCorrupted.collect = APP.bitsCorrupted.value + 1;
        }
    }
}

export default Bit;