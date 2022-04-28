import * as CANNON from "cannon-es";
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import { Ball, Bit } from './components/objects';
import { Stats } from './components/stats';
import { Screen } from './components/screen';
import $ from "jquery";

// EXPORTS
export var scene;
export var bitsCorrupted = 0;
export var world;

// CONSTS
const angle = (3 * Math.PI) / 180;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const timeStep = 1 / 60;
const viewOffset = new CANNON.Vec3(0, 6, 0);

// VARS
var controls;
var state = "start";

// set up renderer
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = renderer.domElement;
canvas.setAttribute("display", "block");
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(canvas);

// jquery
$('body').css('font-family',"monospace");
// stats
const stats = new Stats(20*1000);
// screen
const screen = new Screen();

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
  reflectivity: 0.0,
	side: THREE.DoubleSide,
	wireframe: false,
  color: '#50EE25'
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

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
	color: '#E5D449',
  reflectivity: 0.0,
	wireframe: false
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

// VIRUS
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



var bit1 = new Bit(0, new THREE.Vector3(40, 10, 10));
var bitlist = [bit1];
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

// bounding boxes for jumping on objects
var bounding_boxes = Array();
bounding_boxes.push(boxBody.aabb.upperBound.y + 0.2);
bounding_boxes.push(groundBody.aabb.upperBound.y + 0.2)

let sphereDir = new THREE.Vector3(0, 0, 1);
var keyPress = {"w": 0, "a": 0, "s": 0, "d": 0, " ": 0};

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

function updateCamera() {
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

    for (const key in keyPress) {
        if (keyPress[key] == 1) {
            switch (key) {
              case "w": // forward
                sphereBody.applyImpulse(impulseVec);
                break;
              case "s": // backward
                sphereBody.applyImpulse(impulseVec.negate());
                break;
              case "d": // right
                sphereDir.applyEuler(new THREE.Euler(0, -angle, 0));
                updateCamera();
                break;
              case "a": // left
                sphereDir.applyEuler(new THREE.Euler(0, angle, 0));
                updateCamera();
                break;
              case " ": // jump
                if (Math.abs(sphereBody.velocity.y) <= 0.001){
                    sphereBody.applyImpulse(
                        new CANNON.Vec3(0, 40, 0),
                        );
                    break;
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

    groundMesh2.position.copy(groundBody2.position);
    groundMesh2.quaternion.copy(groundBody2.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    for (let i = 0; i < bitlist.length; i++){
      bitsCorrupted += bitlist[i].handleCollisions(sphereMesh.position);
    }

    if (controls.isLocked) {
      move();
      stats.update(bitsCorrupted);
    }
    updateCamera();

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
        updateCamera();
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
window.addEventListener("click", function() {
  if (!controls.isLocked) {
    controls.lock();
  }
});
controls.addEventListener('lock', function () {
  screen.hidePause();
  screen.hideTitle();
  if (state == "start") {
    stats.timer.start(stats.timeToElapse);
    state = "play";
  } else if (state == "play") {
    stats.timer.resume();
  } else if (state == "gameover") {
    state = "start";
  }
});
controls.addEventListener('unlock', function () {
  if (state == "play") {
    screen.showPause();
    stats.timer.pause();
  } else if (state == "gameover") {
    screen.showEnd();
  }
} );
stats.timer.on('done', () => {
  controls.unlock();
  state = "gameover";
  // need to do restart
});