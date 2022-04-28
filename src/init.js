import * as CANNON from "cannon-es";
import * as THREE from 'three';
import * as APP from "./app.js";
import { Bit } from './components/objects';

export function initGround(width, height, depth, position) {
    const groundGeo = new THREE.PlaneGeometry(width, height);
    const groundMat = new THREE.MeshBasicMaterial({ 
    color: '#50EE25',
    reflectivity: 0.0,
        side: THREE.DoubleSide,
        wireframe: false,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);

    const groundPhysMat = new CANNON.Material('ground');
    const groundBody = new CANNON.Body({
        // shape: new CANNON.Plane(), // use this for an infinite plane
        //mass: 10
        // change for length along with groundGeo
        shape: new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2)), // use this for a finite plane
        type: CANNON.Body.STATIC,
        material: groundPhysMat,
        position: position
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    return [groundMesh, groundBody];
}

export function initBox(width, height, depth, position) {
    const boxGeo = new THREE.BoxGeometry(width, height, depth);
    const boxMat = new THREE.MeshBasicMaterial({
        color: '#E5D449',
    reflectivity: 0.0,
        wireframe: false
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);

    const boxPhysMat = new CANNON.Material('box');
    const boxBody = new CANNON.Body({
        mass: 1500,
        shape: new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2)),
        position: position,
        material: boxPhysMat
    });
    boxBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    return [boxMesh, boxBody];
}

export function initBits() {
    const bitlist = [];

    var bit1 = new Bit(0, new THREE.Vector3(40, 10, 10));
    bitlist.push(bit1)
    var bit2 = new Bit(0, new THREE.Vector3(35, 10, 10));
    bitlist.push(bit2);
    var bit3 = new Bit(0, new THREE.Vector3(30, 10, 10));
    bitlist.push(bit3);
    var bit4 = new Bit(0, new THREE.Vector3(25, 10, 10));
    bitlist.push(bit4);
    var bit5 = new Bit(1, new THREE.Vector3(20, 2, 10));
    bitlist.push(bit5);
    var bit6 = new Bit(1, new THREE.Vector3(15, 2, 10));
    bitlist.push(bit6);
    var bit7 = new Bit(1, new THREE.Vector3(10, 2, 10));
    bitlist.push(bit7);
    var bit8 = new Bit(1, new THREE.Vector3(5, 2, 10));
    bitlist.push(bit8);

    return bitlist;
}