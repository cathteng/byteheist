// starter code also from https://github.com/WaelYasmina/cannontutorial/blob/main/src/js/scripts.js

import * as CANNON from "cannon-es";
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Ball, Resistor } from './components/objects';
import { Stats } from './components/stats';
import { Screen } from './components/screen';
import { BasicLights } from './components/lights';
import $ from "jquery";
import * as INIT from './init.js';
import CannonDebugger from 'cannon-es-debugger'
import Timer from "tiny-timer";

// EXPORTS
export var scene;
export var bitsCorrupted = 0;
export var world;

// CONSTS
const angle = (3 * Math.PI) / 180;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const timeStep = 1 / 60;
const viewOffset = new CANNON.Vec3(0, 6, 0);
const groundMeshes = [];
const groundBodies = [];
const boxMeshes = [];
const boxBodies = [];
var bitList = INIT.initBits();
const bounding_boxes = [];

// VARS
var controls;
var state = "start";
var sphereDir = new THREE.Vector3(0, 0, 1);
var keyPress = {"w": 0, "a": 0, "s": 0, "d": 0, " ": 0};
var cannonDebugger;

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
const lights = new BasicLights();
scene.add(lights);

// camera & controls
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// https://github.com/mrdoob/three.js/blob/dev/examples/misc_controls_pointerlock.html
controls = new PointerLockControls( camera, document.body );
scene.add(controls.getObject());
camera.position.set(0, 20, -30);

// ground
const groundPhysMat = new CANNON.Material('ground');


const start_width = 100;
const start_height = 40;
const start_depth = 0.2;
const start_x_pos = 0;
const start_y_pos = 0;
const start_z_pos = 0;
const startObj = INIT.initStart(start_width, start_height, start_depth, new CANNON.Vec3(start_x_pos, start_y_pos, start_z_pos));
groundMeshes.push(startObj[0]);
groundBodies.push(startObj[1]);
const groundObj2 = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 50));
groundMeshes.push(groundObj2[0]);
groundBodies.push(groundObj2[1]);
const end_width = 100;
const end_height = 40;
const end_depth = 0.2;
const end_x_pos = 0;
const end_y_pos = 0;
const end_z_pos = 100;
const endObj = INIT.initEnd(end_width, end_height, end_depth, new CANNON.Vec3(end_x_pos, end_y_pos, end_z_pos));
groundMeshes.push(endObj[0]);
groundBodies.push(endObj[1]);


for (let i = 0; i < groundMeshes.length; i++) {
  scene.add(groundMeshes[i]);
  world.addBody(groundBodies[i]);
}

// box
const boxPhysMat = new CANNON.Material('box');
const boxObj = INIT.initBox(20, 1, 4, new CANNON.Vec3(0, 2.5, 0));
boxMeshes.push(boxObj[0]);
boxBodies.push(boxObj[1]);

for (let i = 0; i < boxMeshes.length; i++) {
  scene.add(boxMeshes[i]);
  world.addBody(boxBodies[i]);
}

const resistor = new Resistor(new THREE.Vector3(15, 0, 0));
resistor.doRotation(new THREE.Vector3(0, Math.PI / 2, 0));
scene.add(resistor);
// debugger;
world.addBody(resistor.body);

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

cannonDebugger = new CannonDebugger(scene, world);

// bounding boxes for jumping on objects
for (const body of boxBodies) {
  bounding_boxes.push(body.aabb.upperBound.y + 0.2)
}
for (const body of groundBodies) {
  bounding_boxes.push(body.aabb.upperBound.y + 0.2)
}

// ref: https://github.com/oliverschwartz/going-viral/blob/master/src/app.js
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

// ref: https://github.com/oliverschwartz/going-viral/blob/master/src/app.js
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
    if (controls.isLocked) {
      world.step(timeStep);

      for (let i = 0; i < groundMeshes.length; i++) {
        groundMeshes[i].position.copy(groundBodies[i].position);
        groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
      }

      for (let i = 0; i < boxMeshes.length; i++) {
        boxMeshes[i].position.copy(boxBodies[i].position);
        boxMeshes[i].quaternion.copy(boxBodies[i].quaternion);
      }

      sphereMesh.position.copy(sphereBody.position);
      sphereMesh.quaternion.copy(sphereBody.quaternion);

      cannonDebugger.update();

      for (let i = 0; i < bitList.length; i++){
        bitsCorrupted += bitList[i].handleCollisions(sphereMesh.position);
      }

      move();
      stats.update(bitsCorrupted);
      
      updateCamera();

      // reset if you fall off
      if (sphereMesh.position.y < -40) {
        reset();
      }

      //(sphereMesh.position.z > z_pos - depth && sphereMesh.position.z < z_pos + depth)
      //&& 
      // sphereMesh.position.x > x_pos - width && sphereMesh.position.x < x_pos + width
      if ((sphereMesh.position.z > start_z_pos - start_height/2 && sphereMesh.position.z < start_z_pos + start_height/2) &&
          (sphereMesh.position.x > start_x_pos - start_width/2 && sphereMesh.position.x < start_x_pos + start_width/2)){
          // console.log('start');
      }

      if ((sphereMesh.position.z > end_z_pos - end_height/2 && sphereMesh.position.z < end_z_pos + end_height/2) &&
          (sphereMesh.position.x > end_x_pos - end_width/2 && sphereMesh.position.x < end_x_pos + end_width/2) &&
          bitsCorrupted == 8){
        state = "win";
        controls.unlock();
      }
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
    screen.hideWin();
  } else if (state == "play") {
    stats.timer.resume();
    screen.hidePause();
  } else if (state == "gameover") {
    restart();
  } else if (state == "win") {
    restart();
  }
});
controls.addEventListener('unlock', function () {
  if (state == "play") {
    screen.showPause();
    stats.timer.pause();
  } else if (state == "gameover") {
    screen.showEnd();
  } else if (state == "win") {
    screen.showWin();
  }
} );
stats.timer.on('done', () => {
  controls.unlock();
  state = "gameover";
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

function restart() {
  state = "play";
  screen.hideEnd();
  screen.hideWin();
  reset();
  stats.timer.stop();
  stats.timer.start(stats.timeToElapse);
  bitsCorrupted = 0;
  for (let bit of bitList) {
    bit.mesh.visible = false;
    bit = null;
  }
  bitList = INIT.initBits();
}