import * as THREE from "three";
import * as CANNON from "cannon";
import * as APP from "../../app.js";

class Bit {
    constructor(position) {
        this.position = position.clone();
        this.corrupted = false;

        const bitCollectGeo = new THREE.SphereGeometry(1);
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