import * as CANNON from "cannon-es";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
const angle = (3 * Math.PI) / 180;

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

// const boxGeo = new THREE.BoxGeometry(2, 2, 2);
// const boxMat = new THREE.MeshBasicMaterial({
// 	color: 0x00ff00,
// 	wireframe: true
// });
// const boxMesh = new THREE.Mesh(boxGeo, boxMat);
// scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({ 
	color: 0xff0000, 
	wireframe: true,
 });
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0)
});

const groundPhysMat = new CANNON.Material();

const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),
    //mass: 10
    shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// const boxPhysMat = new CANNON.Material();

// const boxBody = new CANNON.Body({
//     mass: 1,
//     shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
//     position: new CANNON.Vec3(1, 20, 0),
//     material: boxPhysMat
// });
// world.addBody(boxBody);

// boxBody.angularVelocity.set(0, 10, 0);
// boxBody.angularDamping = 0.5;

// const groundBoxContactMat = new CANNON.ContactMaterial(
//     groundPhysMat,
//     boxPhysMat,
//     {friction: 0.04}
// );

// world.addContactMaterial(groundBoxContactMat);

const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat
});
world.addBody(sphereBody);

sphereBody.linearDamping = 0.21

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.3} // bounce factor
);

world.addContactMaterial(groundSphereContactMat);

const timeStep = 1 / 60;


let sphereDir = new THREE.Vector3(0, 0, 1);
var keyPress = {"w": 0, "a": 0, "s": 0, "d": 0, " ": 0};
var keys = ["w", "a", "s", "d", " "];

function keyDown(event) {
    for (var key in keyPress) {
        if (event.key == key) keyPress[key] = 1;
    }
}

function keyUp(event) {
    for (var key in keyPress) {
        if (event.key == key) keyPress[key] = 0;
    }
}

function focusCamera() {
    let negDirection = sphereDir.clone().normalize().negate();
    negDirection = negDirection.multiplyScalar(30);
    let destination = sphereMesh.position.clone().add(negDirection);
    camera.position.set(
      destination.x,
      sphereMesh.position.y + 20,
      destination.z
    );
    camera.lookAt(sphereMesh.position);
  }

function move() {
    let impulseVec = new CANNON.Vec3(sphereDir.x, 0, sphereDir.z);

    for (const key in keyPress) {
        if (keyPress[key] == 1) {
            switch (key) {
              case "w": // Apply forward impulse if ArrowUp
                sphereBody.applyImpulse(impulseVec, sphereBody.position);
                break;
              case "s": // Apply backward impulse if ArrowDown
                sphereBody.applyImpulse(impulseVec.negate(), sphereBody.position);
                break;
              case "d": // Change the ball's direction, update camera if ArrowRight
                sphereDir.applyEuler(new THREE.Euler(0, -angle, 0));
                focusCamera();
                break;
              case "a": // Change the ball's direction; update camera if ArrowLeft
                sphereDir.applyEuler(new THREE.Euler(0, angle, 0));
                focusCamera();
                break;
              case " ": // Jump! (only if not in the air) if Spacebar
                if (sphereBody.position.y <= sphereRestHeight + EPS) {
                  sphereBody.applyImpulse(
                    new CANNON.Vec3(0, 5, 0),
                    sphereBody.position
                  );
                }
            break;
            }
        }
    }
}

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    // boxMesh.position.copy(boxBody.position);
    // boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    // sphereMesh.quaternion.copy(sphereBody.quaternion);

    move();
    focusCamera();

    // reset if you fall off
    if (sphereMesh.position.y < -40) {
        sphereBody.position = new CANNON.Vec3(0, 10, 0);
        sphereMesh.position.copy(sphereBody.position);
        sphereBody.velocity = new CANNON.Vec3(0, 0, 0);
        // sphereBody.quaternion = sphereBody.initQuaternion;
        // sphereMesh.quaternion.copy(sphereBody.quaternion);
        groundBody.position = groundBody.initPosition;
        groundMesh.position.copy(groundBody.position);
        sphereBody.angularVelocity = new CANNON.Vec3(0, 0, 0);
        sphereDir = new THREE.Vector3(0, 0, 1);
        focusCamera();
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);