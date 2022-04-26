import * as CANNON from "cannon-es";
import * as THREE from 'three';
import { ObjectSpaceNormalMap } from "three";
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import { Ball, Bit } from './components/objects';

export var scene;
export var bitsCorrupted = 0;
const angle = (3 * Math.PI) / 180;
const renderer = new THREE.WebGLRenderer({ antialias: true });
export var world;
const viewOffset = new CANNON.Vec3(0, 6, 0);
var controls;

// set up renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

scene = new THREE.Scene();
world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -20, 0)
});

// lights
const dir = new THREE.SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
const ambi = new THREE.AmbientLight(0x404040, 1);
const hemi = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
dir.position.set(5, 1, 2);
dir.target.position.set(0, 0, 0);
scene.add(ambi, hemi, dir);

// camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// https://github.com/mrdoob/three.js/blob/dev/examples/misc_controls_pointerlock.html
controls = new PointerLockControls( camera, document.body );
scene.add(controls.getObject());

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();
camera.position.set(0, 20, -30);

// ground
const groundGeo = new THREE.PlaneGeometry(100, 40);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

// const world = new CANNON.World({
//     gravity: new CANNON.Vec3(0, -20, 0)
// });

const groundPhysMat = new CANNON.Material('ground');
const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(), // use this for an infinite plane
    //mass: 10
    // change for length along with groundGeo
    shape: new CANNON.Box(new CANNON.Vec3(50, 20, 0.1)), // use this for a finite plane
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// add another platform
const groundMesh2 = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh2);
const groundBody2 = new CANNON.Body({
  // shape: new CANNON.Plane(), // use this for an infinite plane
  //mass: 10
  // change for length along with groundGeo
  shape: new CANNON.Box(new CANNON.Vec3(50, 20, 0.1)), // use this for a finite plane
  type: CANNON.Body.STATIC,
  material: groundPhysMat,
  position: new CANNON.Vec3(0, 0, 50)
});
world.addBody(groundBody2);
groundBody2.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
const boxPhysMat = new CANNON.Material('box');

// box
const boxGeo = new THREE.BoxGeometry(20, 1, 5);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

//const boxPhysMat = new CANNON.Material('box');
const boxBody = new CANNON.Body({
    mass: 1500,
    shape: new CANNON.Box(new CANNON.Vec3(10, 0.5, 2.5)),
    position: new CANNON.Vec3(0, 2.5, 0),
    material: boxPhysMat
});
world.addBody(boxBody);
boxBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// sphere
// const sphereGeo = new THREE.SphereGeometry(2);
// const sphereMat = new THREE.MeshBasicMaterial({ 
// 	color: 0xff0000, 
// 	wireframe: true,
//  });

// const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
// scene.add(sphereMesh);

const sphereMesh = new Ball();
scene.add(sphereMesh);

const spherePhysMat = new CANNON.Material('virus');

const radius = 2;
const sphereBody = new CANNON.Body({
    mass: 2,
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat,
    linearDamping: 0.5,
    angularDamping: 0.5
});
world.addBody(sphereBody);

let bit = new Bit(new THREE.Vector3(40, 2, 10));
// scene.add(bit);

// boxBody.angularVelocity.set(0, 10, 0);
// boxBody.angularDamping = 0.5;

// const groundBoxContactMat = new CANNON.ContactMaterial(
//     groundPhysMat,
//     boxPhysMat,
//     {friction: 0.04}
// );

// world.addContactMaterial(groundBoxContactMat);

// contact materials
const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.1, friction: 0.7} // bounce factor
);

world.addContactMaterial(groundSphereContactMat);

const boxSphereContactMat = new CANNON.ContactMaterial(
    boxPhysMat,
    spherePhysMat,
    {restitution: 0.1, friction: 0.7} // bounce factor
);

world.addContactMaterial(boxSphereContactMat);


world.addContactMaterial(boxSphereContactMat);

var bounding_boxes = Array();
bounding_boxes.push(boxBody.aabb.upperBound.y + 0.2);
bounding_boxes.push(groundBody.aabb.upperBound.y + 0.2)




const timeStep = 1 / 60;

let sphereDir = new THREE.Vector3(0, 0, 1);
var keyPress = {"w": 0, "a": 0, "s": 0, "d": 0, " ": 0};
var keys = ["w", "a", "s", "d", " "];

function keyDown(event) {
    if (event.key == "l" && controls.isLocked) controls.unlock();
    else if (event.key == "l" && !controls.isLocked) controls.lock();
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
    camera.lookAt(sphereMesh.position.clone().add(viewOffset));
  }

function move() {
    let impulseVec = new CANNON.Vec3(sphereDir.x, 0, sphereDir.z);
    impulseVec.scale(10);
    let sphereRestHeight = 2.0;

    for (const key in keyPress) {
        if (keyPress[key] == 1) {
            switch (key) {
              case "w": // Apply forward impulse if ArrowUp
                sphereBody.applyImpulse(impulseVec);
                break;
              case "s": // Apply backward impulse if ArrowDown
                sphereBody.applyImpulse(impulseVec.negate());
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
                if (Math.abs(sphereBody.velocity.y) <= 0.001){
                    sphereBody.applyImpulse(
                        new CANNON.Vec3(0, 40, 0),
                        );
                    break;
                }
                
                // if (sphereBody.position.y <= sphereRestHeight + 0.1) {
                //   sphereBody.applyImpulse(
                //     new CANNON.Vec3(0, 30, 0),
                //   );
                // }
            break;
            }
        }
    }
}

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    groundMesh2.position.copy(groundBody2.position);
    groundMesh2.quaternion.copy(groundBody2.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    bitsCorrupted += bit.handleCollisions(sphereMesh.position);
    console.log(bitsCorrupted);

    if (controls.isLocked) {
      move();
    }
    focusCamera();

    // reset if you fall off
    if (sphereMesh.position.y < -40) {
        sphereBody.position = new CANNON.Vec3(0, 10, 0);
        sphereMesh.position.copy(sphereBody.position);
        sphereBody.velocity = new CANNON.Vec3(0, 0, 0);
        sphereBody.quaternion = sphereBody.initQuaternion;
        sphereMesh.quaternion.copy(sphereBody.quaternion);
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