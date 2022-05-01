// starter code also from https://github.com/WaelYasmina/cannontutorial/blob/main/src/js/scripts.js

import * as CANNON from "cannon-es";
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Stats } from './components/stats';
import { Screen } from './components/screen';
import { BasicLights } from './components/lights';
import { Level } from './components/level';
import { Copper } from './components/objects';
import $ from "jquery";
import * as INIT from './init.js';
import CannonDebugger from 'cannon-es-debugger';

// EXPORTS
export var scene;
export var bitsCorrupted = 0;
export var world;
export var state;

// CONSTS
const angle = (3 * Math.PI) / 180;
const renderer = new THREE.WebGLRenderer({ antialias: true });
const timeStep = 1 / 60;
const viewOffset = new CANNON.Vec3(0, 6, 0);
const totalLevels = 1;
const gravity = new CANNON.Vec3(0, -20, 0);
const timePerLevel = [60*1000, 60*1000];

// VARS
var controls;
state = "start";
var sphereDir = new THREE.Vector3(0, 0, 1);
var keyPress = {"w": 0, "a": 0, "s": 0, "d": 0, " ": 0};
var cannonDebugger;
var currentLevel = 0;
var groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList;
var copperList = [];

// set up renderer
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;
const canvas = renderer.domElement;
canvas.setAttribute("display", "block");
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(canvas);

// jquery
$('body').css('font-family',"monospace");
// stats
const stats = new Stats();
// screen
const screen = new Screen();

scene = new THREE.Scene();
world = new CANNON.World({gravity: gravity});
scene.background = new THREE.Color( '#404040' );

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
// level start
var level = new Level(totalLevels);
({groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList} = level.changeLevel(currentLevel));
cannonDebugger = new CannonDebugger(scene, world);

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

function reset() {
  sphereBody.position = new CANNON.Vec3(0, 10, 0);
  sphereMesh.position.copy(sphereBody.position);
  sphereBody.velocity = new CANNON.Vec3(0, 0, 0);
  sphereBody.quaternion = sphereBody.initQuaternion;
  sphereMesh.quaternion.copy(sphereBody.quaternion);
  sphereBody.angularVelocity = new CANNON.Vec3(0, 0, 0);
  sphereDir = new THREE.Vector3(0, 0, 1);
  updateCamera();
}

function restart() {
  currentLevel = 0;
  state = "play";
  screen.hideEnd();
  screen.hideWin();
  bitsCorrupted = 0; 

  setLevel();
}

function setLevel() {
  scene = new THREE.Scene();
  world = new CANNON.World({gravity: gravity});
  // lights
  scene.add(lights);
  scene.add(controls.getObject());
  camera.position.set(0, 20, -30);
  ({groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList} = level.changeLevel(currentLevel));
  stats.timer.stop();
  stats.timer.start(timePerLevel[currentLevel]);
  bitsCorrupted = 0;
  reset();
}

console.log(scene);
function animate() {
    if (controls.isLocked) {
      world.step(timeStep);

      sphereMesh.position.copy(sphereBody.position);
      sphereMesh.quaternion.copy(sphereBody.quaternion);

      // cannonDebugger.update();

      for (let i = 0; i < bitList.length; i++){
        bitsCorrupted += bitList[i].handleCollisions(sphereMesh.position);
      }
      for (let copper of copperList) {
        if (copper.handleCollisions(sphereBody.position) == 1) {
          controls.unlock();
          state = 'gameover';
        }
      }

      // for (let i = 0; i < wireList.length; i++) {
      //   wireList[i].handleCollisions(sphereBody.position);
      // }

      move();
      stats.update(bitsCorrupted, currentLevel);
      updateCamera();

      // reset if you fall off
      if (sphereMesh.position.y < -40) reset();

      //(sphereMesh.position.z > z_pos - depth && sphereMesh.position.z < z_pos + depth)
      //&& 
      // sphereMesh.position.x > x_pos - width && sphereMesh.position.x < x_pos + width
      // if ((sphereMesh.position.z > start_z_pos - start_height/2 && sphereMesh.position.z < start_z_pos + start_height/2) &&
          // (sphereMesh.position.x > start_x_pos - start_width/2 && sphereMesh.position.x < start_x_pos + start_width/2)){
          // console.log('start');
      // }

      if (bitsCorrupted > 0) {
        scene.add(arrow.mesh);
        arrow.bob();
        const white = new THREE.MeshPhongMaterial({ 
          color: '#ffffff',
          side: THREE.DoubleSide,
        });
        groundMesh.material = white;
        if ((sphereMesh.position.z > end_pos.z - end_height/2 && sphereMesh.position.z < end_pos.z + end_height/2) &&
            (sphereMesh.position.x > end_pos.x - end_width/2 && sphereMesh.position.x < end_pos.z + end_width/2)) {
          if (currentLevel == totalLevels) {
            state = "win";
            controls.unlock();
          } else if (currentLevel < totalLevels) {
            currentLevel += 1;
            setLevel();
          }
        }
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
    stats.timer.start(timePerLevel[currentLevel]);
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