import * as CANNON from "cannon-es";
import * as THREE from 'three';
import * as APP from "./app.js";
import { Bit, Ball, Resistor, Capacitor } from './components/objects';

const groundPhysMat = new CANNON.Material('ground');
const boxPhysMat = new CANNON.Material('box');
const spherePhysMat = new CANNON.Material('virus');
const capMat = new CANNON.Material('cap');

export function initGround(width, height, depth, position, color) {
    const groundGeo = new THREE.PlaneGeometry(width, height, 20, 20);
    const groundMat = new THREE.MeshPhongMaterial({ 
        color: color,
        side: THREE.DoubleSide
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);

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

    return {groundMesh, groundBody};
}

// export function 

export function initBox(width, height, depth, position, color) {
    const boxGeo = new THREE.BoxGeometry(width, height, depth);
    const boxMat = new THREE.MeshPhongMaterial({
        color: color,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);

    const boxBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2)),
        position: position,
        material: boxPhysMat,
        type: CANNON.Body.STATIC
    });
    boxBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    return {boxMesh, boxBody};
}

export function initSphere() {
    const sphereMesh = new Ball();
    const radius = 2;
    const sphereBody = new CANNON.Body({
        mass: 2,
        shape: new CANNON.Sphere(radius),
        position: new CANNON.Vec3(0, 10, 0),
        material: spherePhysMat,
        linearDamping: 0.5,
        angularDamping: 0.5
    });
    return {sphereMesh, sphereBody};
}


export function initResistor(postion) {
    const resistor = new Resistor(postion, new THREE.Vector3(0, Math.PI / 2, 0), groundPhysMat);
    resistor.doRotation(new THREE.Vector3(0, Math.PI / 2, 0));
    return resistor;
}

export function initCapacitor(position) {
    const capacitor = new Capacitor(position, capMat);
    return capacitor;
}

export function initContactMaterials() {
    // contact materials
    const groundSphereContactMat = new CANNON.ContactMaterial(
        groundPhysMat,
        spherePhysMat,
        {restitution: 0.1, friction: 0.7}
    );

    const boxSphereContactMat = new CANNON.ContactMaterial(
        boxPhysMat,
        spherePhysMat,
        {restitution: 0.1, friction: 0.7}
    );

    const capacitorMat = new CANNON.ContactMaterial(
        capMat,
        spherePhysMat,
        {restitution: 3, friction: 0.7}
      );

    return {groundSphereContactMat, boxSphereContactMat, capacitorMat};
}

export function initBits(numLevel) {
    const bitlist = [];

    if (numLevel == 0){
        var bit1 = new Bit(1, new THREE.Vector3(15, 2, 50));
        bitlist.push(bit1)
        var bit2 = new Bit(0, new THREE.Vector3(-15, 2, 50));
        bitlist.push(bit2);
        var bit3 = new Bit(1, new THREE.Vector3(7.5, 2, 100));
        bitlist.push(bit3);
        var bit4 = new Bit(1, new THREE.Vector3(-7.5, 2, 100));
        bitlist.push(bit4);
        var bit5 = new Bit(0, new THREE.Vector3(22.5, 2, 100));
        bitlist.push(bit5);
        var bit6 = new Bit(0, new THREE.Vector3(-22.5, 2, 100));
        bitlist.push(bit6);
        var bit7 = new Bit(1, new THREE.Vector3(15, 2, 150));
        bitlist.push(bit7);
        var bit8 = new Bit(0, new THREE.Vector3(-15, 2, 150));
        bitlist.push(bit8);
    }

    if (numLevel == 1){
        var bit1 = new Bit(0, new THREE.Vector3(40, 2, 10));
        bitlist.push(bit1)
        var bit2 = new Bit(0, new THREE.Vector3(35, 2, 10));
        bitlist.push(bit2);
        var bit3 = new Bit(0, new THREE.Vector3(30, 2, 10));
        bitlist.push(bit3);
        var bit4 = new Bit(0, new THREE.Vector3(25, 2, 10));
        bitlist.push(bit4);
        var bit5 = new Bit(1, new THREE.Vector3(20, 2, 10));
        bitlist.push(bit5);
        var bit6 = new Bit(1, new THREE.Vector3(15, 2, 10));
        bitlist.push(bit6);
        var bit7 = new Bit(1, new THREE.Vector3(10, 2, 10));
        bitlist.push(bit7);
        var bit8 = new Bit(1, new THREE.Vector3(5, 2, 10));
        bitlist.push(bit8);
    }

    if (numLevel == 2){
        var bit1 = new Bit(0, new THREE.Vector3(40, 2, 10));
        bitlist.push(bit1)
        var bit2 = new Bit(0, new THREE.Vector3(35, 2, 10));
        bitlist.push(bit2);
        var bit3 = new Bit(0, new THREE.Vector3(30, 2, 10));
        bitlist.push(bit3);
        var bit4 = new Bit(0, new THREE.Vector3(25, 2, 10));
        bitlist.push(bit4);
        var bit5 = new Bit(1, new THREE.Vector3(20, 2, 10));
        bitlist.push(bit5);
        var bit6 = new Bit(1, new THREE.Vector3(15, 2, 10));
        bitlist.push(bit6);
        var bit7 = new Bit(1, new THREE.Vector3(10, 2, 10));
        bitlist.push(bit7);
        var bit8 = new Bit(1, new THREE.Vector3(5, 2, 10));
        bitlist.push(bit8);
    }

    return bitlist;
}