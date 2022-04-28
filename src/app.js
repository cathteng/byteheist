import * as CANNON from "cannon-es";
import * as THREE from 'three';
import { ObjectSpaceNormalMap } from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Bit from "./components/bit/Bit";
import { Ball } from './components/objects';

export var scene;
export var bitsCorrupted;
const angle = (3 * Math.PI) / 180;
const renderer = new THREE.WebGLRenderer({ antialias: true });

// set up renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(canvas);

// jquery
$('body').css('font-family',"monospace");
// stats
const seconds = 5;
const stats = new Stats(seconds*1000);
// screen
const screen = new Screen();

scene = new THREE.Scene();

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

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();
camera.position.set(0, 20, -30);

const boxGeo = new THREE.BoxGeometry(20, 1, 5);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

// const sphereGeo = new THREE.SphereGeometry(2);
// const sphereMat = new THREE.MeshBasicMaterial({ 
// 	color: 0xff0000, 
// 	wireframe: true,
//  });

// const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
// scene.add(sphereMesh);
const sphereMesh = new Ball();
scene.add(sphereMesh);

/////////////
bitsCorrupted = {
  value: 0,
  set collect(val) {
    this.value = val;
  }
};
//////////////

const groundGeo = new THREE.PlaneGeometry(100, 40);
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
    // change for length allong with groundGeo
    shape: new CANNON.Box(new CANNON.Vec3(50, 20, 0.1)),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    mass: 1500,
    shape: new CANNON.Box(new CANNON.Vec3(10, 0.5, 2.5)),
    position: new CANNON.Vec3(0, 2.5, 0),
    material: boxPhysMat
});
world.addBody(boxBody);
boxBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

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

const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    mass: 2,
    shape: new CANNON.Sphere(2),
    position: new CANNON.Vec3(0, 10, 0),
    material: spherePhysMat,
    linearDamping: 0.5,
    angularDamping: 0.5
});
world.addBody(sphereBody);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.1, friction: 0.7} // bounce factor
);

world.addContactMaterial(groundSphereContactMat);

// const boxSphereContactMat = new CANNON.ContactMaterial(
//     boxPhysMat,
//     spherePhysMat,
//     {restitution: 0.3, friction: 0.5} // bounce factor
// );

// world.addContactMaterial(boxSphereContactMat);

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
              //console.log('space')
                if (sphereBody.position.y <= sphereRestHeight + 0.1) {
                  sphereBody.applyImpulse(
                    new CANNON.Vec3(0, 50, 0),
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

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    bit.handleCollisions(sphereMesh.position);

    move();
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

window.addEventListener("keydown", function(event) {
  for (var key in keyPress) {
    if (event.key == key) keyPress[key] = 1;
  }
});

window.addEventListener("keyup", function(event) {
  for (var key in keyPress) {
    if (event.key == key) keyPress[key] = 0;
  }
});

window.addEventListener("click", function() {
  if (!controls.isLocked) {
    controls.lock();
  }
});
controls.addEventListener('lock', function () {
  if (state == "start") {
    stats.timer.start(stats.timeToElapse);
    state = "play";
    screen.hidePause();
    screen.hideTitle();
  } else if (state == "play") {
    stats.timer.resume();
    screen.hidePause();
  } else if (state == "gameover") {
    state = "start";
    screen.hideEnd();
    reset();
    stats.timer.start(stats.timeToElapse); // reset timer
    // reset bits TODO
    bitsCorrupted = 0;
    for (let bit of bitList) {
         bit.mesh.visible = false;
         bit = null;
    }
    bitList = INIT.initBits();
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

function reset() {
  sphereBody.position = new CANNON.Vec3(0, 10, 0);
  sphereMesh.position.copy(sphereBody.position);
  sphereBody.velocity = new CANNON.Vec3(0, 0, 0);
  sphereBody.quaternion = sphereBody.initQuaternion;
  sphereMesh.quaternion.copy(sphereBody.quaternion);
  for (let i = 0; i < groundMeshes.length; i++) {
    groundBodies[i].position = groundBodies[i].initPosition;
    groundMeshes[i].position.copy(groundBodies[i].position);
  }
  sphereBody.angularVelocity = new CANNON.Vec3(0, 0, 0);
  sphereDir = new THREE.Vector3(0, 0, 1);
  updateCamera();
}
