import * as CANNON from "cannon-es";
import * as INIT from "../../init.js";
import * as APP from "../../app.js";
import { Arrow, Resistor } from "../objects";
import * as THREE from "three";

class Level {
  constructor(totalLevels) {
    this.currentLevel = 0;
    this.maxLevels = totalLevels;
    this.functions = {
      0: this._levelZero,
      1: this._levelOne,
      2: this._levelTwo,
    };
  }
  changeLevel(level) {
    this.currentLevel = level;
    return this.functions[level]();
  }
  _levelZero() {
    // consts
    const groundMeshes = [];
    const groundBodies = [];
    const copperList = [];

    // start platform
    const start_width = 100;
    const start_height = 40;
    const start_depth = 0.2;
    const start_pos = new CANNON.Vec3(0, 0, 0);
    var { groundMesh, groundBody } = INIT.initGround(
      start_width,
      start_height,
      start_depth,
      start_pos,
      "#0045AD"
    );
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // middle platforms
    const middlePlatforms = [
      new CANNON.Vec3(0, 0, 50),
      new CANNON.Vec3(0, 0, 100),
      new CANNON.Vec3(0, 0, 150),
      new CANNON.Vec3(0, 0, 200),
    ];
    const platformColor = "#006F27";

    for (const p of middlePlatforms) {
      ({ groundMesh, groundBody } = INIT.initGround(
        start_width,
        start_height,
        start_depth,
        p,
        platformColor
      ));
      groundMeshes.push(groundMesh);
      groundBodies.push(groundBody);
    }

    // end platform
    const end_width = 20;
    const end_height = 20;
    const end_depth = 0.2;
    const end_pos = new CANNON.Vec3(0, 0, 250);

    ({ groundMesh, groundBody } = INIT.initGround(
      end_width,
      end_height,
      end_depth,
      end_pos,
      "#FFD700"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    for (let i = 0; i < groundMeshes.length; i++) {
      // bloom pass?
      groundMeshes[i].layers.enable(1);
      
      APP.scene.add(groundMeshes[i]);
      APP.world.addBody(groundBodies[i]);
      groundMeshes[i].position.copy(groundBodies[i].position);
      groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
    }

    // sphere
    var { sphereMesh, sphereBody } = INIT.initSphere(new CANNON.Vec3(0, 10, 0));
    APP.scene.add(sphereMesh);
    APP.world.addBody(sphereBody);

    // resistors
    const resistorPositions = [
      new THREE.Vector3(15, 0, 100),
      new THREE.Vector3(0, 0, 100),
      new THREE.Vector3(-15, 0, 100),
      new THREE.Vector3(-30, 0, 100),
      new THREE.Vector3(30, 0, 100),
    ];
    for (const r of resistorPositions) {
      var resistor = INIT.initResistor(r, 1);
      APP.scene.add(resistor);
      resistor.addBodies(APP.world);
    }

    // capacitor
    const capacitorPositions = [
      new THREE.Vector3(0, 2.5, 150),
      new THREE.Vector3(-30, 2.5, 150),
      new THREE.Vector3(30, 2.5, 150),
    ];
    for (const c of capacitorPositions) {
      var capacitor = INIT.initCapacitor(c);
      APP.scene.add(capacitor);
      APP.world.addBody(capacitor.body);
    }

    // copper
    const copperPositions = [
      new THREE.Vector3(-20, 0.5, 210),
      new THREE.Vector3(-20, 0.5, 205),
      new THREE.Vector3(20, 0.5, 210),
      new THREE.Vector3(20, 0.5, 205),
      new THREE.Vector3(-20, 0.5, 200),
      new THREE.Vector3(-20, 0.5, 195),
      new THREE.Vector3(20, 0.5, 200),
      new THREE.Vector3(20, 0.5, 195),
    ];
    for (const cp of copperPositions) {
      var copper = INIT.initCopper(cp, 1, 20, 1);
      APP.scene.add(copper.mesh);
      copperList.push(copper);
    }

    // arrow
    const arrow = new Arrow(new CANNON.Vec3(0, 10, 250));

    // bits
    const bitList = INIT.initBits(0);

    // materials
    const contacts = INIT.initContactMaterials();
    APP.world.addContactMaterial(contacts.groundSphereContactMat);
    APP.world.addContactMaterial(contacts.boxSphereContactMat);
    APP.world.addContactMaterial(contacts.capacitorMat);

    var audio = new Audio('src/components/music/ambient-cinematic-hip-hop-22168.mp3');


    return {
      groundMesh,
      end_width,
      end_height,
      end_pos,
      sphereMesh,
      sphereBody,
      arrow,
      bitList,
      copperList,
      audio,
    };
  }
  _levelOne() {
    // consts
    const groundMeshes = [];
    const groundBodies = [];
    const boxMeshes = [];
    const boxBodies = [];
    const copperList = [];

    // positions
    const resistorPositions = [];
    const capacitorPositions = [];
    const copperPositions = [];

    // start
    const start_width = 100;
    const start_height = 40;
    const start_depth = 0.2;
    const start_pos = new CANNON.Vec3(0, 0, 0);
    var { groundMesh, groundBody } = INIT.initGround(
      start_width,
      start_height,
      start_depth,
      start_pos,
      "#EE7700"
    );
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // middle
    ({ groundMesh, groundBody } = INIT.initGround(
      100,
      500,
      0.2,
      new CANNON.Vec3(0, 0, 275),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // end
    const end_width = 20;
    const end_height = 20;
    const end_depth = 0.2;
    const end_pos = new CANNON.Vec3(0, 0.01, 500);
    ({ groundMesh, groundBody } = INIT.initGround(
      end_width,
      end_height,
      end_depth,
      end_pos,
      "#FFD700"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    for (let i = 0; i < groundMeshes.length; i++) {
      APP.scene.add(groundMeshes[i]);
      APP.world.addBody(groundBodies[i]);
      groundMeshes[i].position.copy(groundBodies[i].position);
      groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
    }

    // wall 1
    var { boxMesh, boxBody } = INIT.initBox(
      50,
      1,
      15,
      new CANNON.Vec3(25, 7.5, 50),
      "#E70000"
    );
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      30,
      1,
      15,
      new CANNON.Vec3(-25, 7.5, 50),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    resistorPositions.push(
      [new THREE.Vector3(10, 0, 75), 2],
      [new THREE.Vector3(-40, 0, 75), 1]
    );

    capacitorPositions.push(new THREE.Vector3(40, 2.5, 75));

    // wall 2
    ({ boxMesh, boxBody } = INIT.initBox(
      80,
      1,
      15,
      new CANNON.Vec3(-10, 7.5, 100),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(45, 7.5, 100),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    capacitorPositions.push(
      new THREE.Vector3(-25, 2.5, 110),
      new THREE.Vector3(0, 2.5, 125),
      new THREE.Vector3(25, 2.5, 140)
    );

    // wall 3
    ({ boxMesh, boxBody } = INIT.initBox(
      60,
      1,
      15,
      new CANNON.Vec3(20, 7.5, 150),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    resistorPositions.push(
      [new THREE.Vector3(10, 0, 165), 3],
      [new THREE.Vector3(20, 0, 165), 3],
      [new THREE.Vector3(30, 0, 165), 3],
      [new THREE.Vector3(40, 0, 165), 3]
    );

    capacitorPositions.push(new THREE.Vector3(-25, 2.5, 175));

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-25, 7.5, 150),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-45, 7.5, 150),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    // wall 4
    ({ boxMesh, boxBody } = INIT.initBox(
      70,
      1,
      15,
      new CANNON.Vec3(0, 7.5, 200),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(45, 7.5, 200),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-45, 7.5, 200),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    copperPositions.push(
      [new THREE.Vector3(-20, 0.5, 210), 2, 20, 1],
      [new THREE.Vector3(-20, 0.5, 220), 2, 20, 1],
      [new THREE.Vector3(20, 0.5, 210), 2, 20, 1],
      [new THREE.Vector3(20, 0.5, 220), 2, 20, 1],
      [new THREE.Vector3(-20, 0.5, 230), 2, 20, 1],
      [new THREE.Vector3(-20, 0.5, 240), 2, 20, 1],
      [new THREE.Vector3(20, 0.5, 230), 2, 20, 1],
      [new THREE.Vector3(20, 0.5, 240), 2, 20, 1]
    );

    // wall 5
    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-45, 7.5, 250),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    resistorPositions.push(
      [new THREE.Vector3(-45, 0, 275), 3],
      [new THREE.Vector3(-22.5, 0, 275), 3],
      [new THREE.Vector3(0, 0, 275), 3],
      [new THREE.Vector3(22.5, 0, 275), 3],
      [new THREE.Vector3(45, 0, 275), 3]
    );

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-22.5, 7.5, 250),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(0, 7.5, 250),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(22.5, 7.5, 250),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(45, 7.5, 250),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    // wall 6
    ({ boxMesh, boxBody } = INIT.initBox(
      90,
      1,
      15,
      new CANNON.Vec3(0, 7.5, 300),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    capacitorPositions.push(
      new THREE.Vector3(-10, 2.5, 325),
      new THREE.Vector3(10, 2.5, 325),
      new THREE.Vector3(0, 2.5, 315),
      new THREE.Vector3(0, 2.5, 335)
    );

    //wall 7
    ({ boxMesh, boxBody } = INIT.initBox(
      40,
      1,
      15,
      new CANNON.Vec3(0, 7.5, 350),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      20,
      1,
      15,
      new CANNON.Vec3(-40, 7.5, 350),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      20,
      1,
      15,
      new CANNON.Vec3(40, 7.5, 350),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    copperPositions.push(
      [new THREE.Vector3(0, 0.5, 375), 50, 2, 1],
      [new THREE.Vector3(-40, 0.5, 375), 50, 2, 1],
      [new THREE.Vector3(41, 0.5, 375), 50, 2, 1]
    );

    // wall 8
    ({ boxMesh, boxBody } = INIT.initBox(
      60,
      1,
      15,
      new CANNON.Vec3(20, 7.5, 400),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-25, 7.5, 400),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(-45, 7.5, 400),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    capacitorPositions.push(
      new THREE.Vector3(30, 2.5, 410),
      new THREE.Vector3(20, 2.5, 420),
      new THREE.Vector3(10, 2.5, 430),
      new THREE.Vector3(0, 2.5, 440),
      new THREE.Vector3(-10, 2.5, 430),
      new THREE.Vector3(-20, 2.5, 420),
      new THREE.Vector3(-30, 2.5, 410)
    );

    // wall 9
    ({ boxMesh, boxBody } = INIT.initBox(
      80,
      1,
      15,
      new CANNON.Vec3(-10, 7.5, 450),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    ({ boxMesh, boxBody } = INIT.initBox(
      10,
      1,
      15,
      new CANNON.Vec3(45, 7.5, 450),
      "#E70000"
    ));
    boxMeshes.push(boxMesh);
    boxBodies.push(boxBody);

    for (let i = 0; i < boxMeshes.length; i++) {
      APP.scene.add(boxMeshes[i]);
      APP.world.addBody(boxBodies[i]);
      boxMeshes[i].position.copy(boxBodies[i].position);
      boxMeshes[i].quaternion.copy(boxBodies[i].quaternion);
    }

    for (const r of resistorPositions) {
      const resistor = INIT.initResistor(r[0], r[1]);
      APP.scene.add(resistor);
      resistor.addBodies(APP.world);
    }

    for (const c of capacitorPositions) {
      const capacitor = INIT.initCapacitor(c);
      APP.scene.add(capacitor);
      APP.world.addBody(capacitor.body);
    }

    for (const c of copperPositions) {
      const copper = INIT.initCopper(c[0], c[1], c[2], c[3]);
      APP.scene.add(copper.mesh);
      copperList.push(copper);
    }

    // sphere
    var { sphereMesh, sphereBody } = INIT.initSphere(new CANNON.Vec3(0, 10, 0));
    APP.scene.add(sphereMesh);
    APP.world.addBody(sphereBody);

    // arrow
    const arrow = new Arrow(new CANNON.Vec3(0, 10, 500));

    // bits
    const bitList = INIT.initBits(1);

    // materials
    const contacts = INIT.initContactMaterials();
    APP.world.addContactMaterial(contacts.groundSphereContactMat);
    APP.world.addContactMaterial(contacts.boxSphereContactMat);
    APP.world.addContactMaterial(contacts.capacitorMat);

    
    var audio = new Audio('src/components/music/order-99518.mp3');
    
    return {
      groundMesh,
      end_width,
      end_height,
      end_pos,
      sphereMesh,
      sphereBody,
      arrow,
      bitList,
      copperList,
      audio,
    };
  }

  _levelTwo() {
    // consts
    const groundMeshes = [];
    const groundBodies = [];
    const copperList = [];

    const resistorPositions = [];
    const capacitorPositions = [];
    const copperPositions = [];

    // start
    const start_width = 40;
    const start_height = 40;
    const start_depth = 0.2;
    const start_pos = new CANNON.Vec3(0, 0, 0);
    var { groundMesh, groundBody } = INIT.initGround(
      start_width,
      start_height,
      start_depth,
      start_pos,
      "#EE7700"
    );
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // main halls
    ({ groundMesh, groundBody } = INIT.initGround(
      40,
      200,
      0.2,
      new CANNON.Vec3(0, 0, 125),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      200,
      40,
      0.2,
      new CANNON.Vec3(-125, 0, 0),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      40,
      200,
      0.2,
      new CANNON.Vec3(0, 0, -125),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      200,
      40,
      0.2,
      new CANNON.Vec3(125, 0, 0),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // vertical relative to start
    ({ groundMesh, groundBody } = INIT.initGround(
      40,
      200,
      0.2,
      new CANNON.Vec3(-205, 0, -125),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      40,
      200,
      0.2,
      new CANNON.Vec3(-205, 0, 125),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      40,
      200,
      0.2,
      new CANNON.Vec3(205, 0, -125),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      40,
      200,
      0.2,
      new CANNON.Vec3(205, 0, 125),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // horizontal relative to start
    ({ groundMesh, groundBody } = INIT.initGround(
      200,
      40,
      0.2,
      new CANNON.Vec3(125, 0, -205),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      200,
      40,
      0.2,
      new CANNON.Vec3(-125, 0, -205),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      200,
      40,
      0.2,
      new CANNON.Vec3(125, 0, 205),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    ({ groundMesh, groundBody } = INIT.initGround(
      200,
      40,
      0.2,
      new CANNON.Vec3(-125, 0, 205),
      "#006F27"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    // end
    const end_width = 20;
    const end_height = 20;
    const end_depth = 0.2;
    const end_pos = new CANNON.Vec3(0, 0.01, 0);

    ({ groundMesh, groundBody } = INIT.initGround(
      end_width,
      end_height,
      end_depth,
      end_pos,
      "#FFD700"
    ));
    groundMeshes.push(groundMesh);
    groundBodies.push(groundBody);

    for (let i = 0; i < groundMeshes.length; i++) {
      APP.scene.add(groundMeshes[i]);
      APP.world.addBody(groundBodies[i]);
      groundMeshes[i].position.copy(groundBodies[i].position);
      groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
    }

    // sphere
    var { sphereMesh, sphereBody } = INIT.initSphere(new CANNON.Vec3(0, 10, 0));
    APP.scene.add(sphereMesh);
    APP.world.addBody(sphereBody);

    // resistor
    resistorPositions.push(
      [new THREE.Vector3(15, 0, 160), 1],
      [new THREE.Vector3(-15, 0, 160), 1],
      [new THREE.Vector3(15, 0, 100), 1],
      [new THREE.Vector3(-15, 0, 100), 1],
      [new THREE.Vector3(15, 0, 40), 1],
      [new THREE.Vector3(-15, 0, 40), 1]
    );

    //
    resistorPositions.push(
      [new THREE.Vector3(-45, 0, 190), 2],
      [new THREE.Vector3(-45, 0, 220), 2],
      [new THREE.Vector3(-105, 0, 190), 2],
      [new THREE.Vector3(-105, 0, 220), 2],
      [new THREE.Vector3(-165, 0, 190), 2],
      [new THREE.Vector3(-165, 0, 220), 2],
      [new THREE.Vector3(45, 0, 190), 2],
      [new THREE.Vector3(45, 0, 220), 2],
      [new THREE.Vector3(105, 0, 190), 2],
      [new THREE.Vector3(105, 0, 220), 2],
      [new THREE.Vector3(165, 0, 190), 2],
      [new THREE.Vector3(165, 0, 220), 2]
    );

    //
    resistorPositions.push(
      [new THREE.Vector3(15, 0, -160), 1],
      [new THREE.Vector3(-15, 0, -160), 1],
      [new THREE.Vector3(15, 0, -100), 1],
      [new THREE.Vector3(-15, 0, -100), 1],
      [new THREE.Vector3(15, 0, -40), 1],
      [new THREE.Vector3(-15, 0, -40), 1]
    );

    //
    resistorPositions.push(
      [new THREE.Vector3(-45, 0, -190), 2],
      [new THREE.Vector3(-45, 0, -220), 2],
      [new THREE.Vector3(-105, 0, -190), 2],
      [new THREE.Vector3(-105, 0, -220), 2],
      [new THREE.Vector3(-165, 0, -190), 2],
      [new THREE.Vector3(-165, 0, -220), 2],
      [new THREE.Vector3(45, 0, -190), 2],
      [new THREE.Vector3(45, 0, -220), 2],
      [new THREE.Vector3(105, 0, -190), 2],
      [new THREE.Vector3(105, 0, -220), 2],
      [new THREE.Vector3(165, 0, -190), 2],
      [new THREE.Vector3(165, 0, -220), 2]
    );

    // capacitor
    capacitorPositions.push(
      new THREE.Vector3(0, 2.5, 130),
      new THREE.Vector3(0, 2.5, 70),
      new THREE.Vector3(0, 2.5, -130),
      new THREE.Vector3(0, 2.5, -70)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(135, 2.5, -205),
      new THREE.Vector3(75, 2.5, -205),
      new THREE.Vector3(135, 2.5, 205),
      new THREE.Vector3(75, 2.5, 205),
      new THREE.Vector3(-135, 2.5, -205),
      new THREE.Vector3(-75, 2.5, -205),
      new THREE.Vector3(-135, 2.5, 205),
      new THREE.Vector3(-75, 2.5, 205)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(-160, 2.5, 15),
      new THREE.Vector3(-160, 2.5, -15),
      new THREE.Vector3(-100, 2.5, 15),
      new THREE.Vector3(-100, 2.5, -15),
      new THREE.Vector3(-40, 2.5, 15),
      new THREE.Vector3(-40, 2.5, -15)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(160, 2.5, 15),
      new THREE.Vector3(160, 2.5, -15),
      new THREE.Vector3(100, 2.5, 15),
      new THREE.Vector3(100, 2.5, -15),
      new THREE.Vector3(40, 2.5, 15),
      new THREE.Vector3(40, 2.5, -15)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(190, 2.5, 160),
      new THREE.Vector3(220, 2.5, 160),
      new THREE.Vector3(190, 2.5, 100),
      new THREE.Vector3(220, 2.5, 100),
      new THREE.Vector3(190, 2.5, 40),
      new THREE.Vector3(220, 2.5, 40)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(190, 2.5, -160),
      new THREE.Vector3(220, 2.5, -160),
      new THREE.Vector3(190, 2.5, -100),
      new THREE.Vector3(220, 2.5, -100),
      new THREE.Vector3(190, 2.5, -40),
      new THREE.Vector3(220, 2.5, -40)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(-190, 2.5, 160),
      new THREE.Vector3(-220, 2.5, 160),
      new THREE.Vector3(-190, 2.5, 100),
      new THREE.Vector3(-220, 2.5, 100),
      new THREE.Vector3(-190, 2.5, 40),
      new THREE.Vector3(-220, 2.5, 40)
    );

    //
    capacitorPositions.push(
      new THREE.Vector3(-190, 2.5, -160),
      new THREE.Vector3(-220, 2.5, -160),
      new THREE.Vector3(-190, 2.5, -100),
      new THREE.Vector3(-220, 2.5, -100),
      new THREE.Vector3(-190, 2.5, -40),
      new THREE.Vector3(-220, 2.5, -40)
    );

    // copper
    copperPositions.push(
      [new THREE.Vector3(40, 0.5, 0), 20, 1, 1],
      [new THREE.Vector3(100, 0.5, 0), 20, 1, 1],
      [new THREE.Vector3(160, 0.5, 0), 20, 1, 1],
      [new THREE.Vector3(-40, 0.5, 0), 20, 1, 1],
      [new THREE.Vector3(-100, 0.5, 0), 20, 1, 1],
      [new THREE.Vector3(-160, 0.5, 0), 20, 1, 1]
    );

    //
    copperPositions.push(
      [new THREE.Vector3(205, 0.5, 40), 1, 20, 1],
      [new THREE.Vector3(205, 0.5, 100), 1, 20, 1],
      [new THREE.Vector3(205, 0.5, 160), 1, 20, 1],
      [new THREE.Vector3(205, 0.5, -40), 1, 20, 1],
      [new THREE.Vector3(205, 0.5, -100), 1, 20, 1],
      [new THREE.Vector3(205, 0.5, -160), 1, 20, 1]
    );

    //
    copperPositions.push(
      [new THREE.Vector3(-205, 0.5, 40), 1, 20, 1],
      [new THREE.Vector3(-205, 0.5, 100), 1, 20, 1],
      [new THREE.Vector3(-205, 0.5, 160), 1, 20, 1],
      [new THREE.Vector3(-205, 0.5, -40), 1, 20, 1],
      [new THREE.Vector3(-205, 0.5, -100), 1, 20, 1],
      [new THREE.Vector3(-205, 0.5, -160), 1, 20, 1]
    );

    for (const r of resistorPositions) {
      const resistor = INIT.initResistor(r[0], r[1]);
      APP.scene.add(resistor);
      resistor.addBodies(APP.world);
    }

    for (const c of capacitorPositions) {
      const capacitor = INIT.initCapacitor(c);
      APP.scene.add(capacitor);
      APP.world.addBody(capacitor.body);
    }

    for (const c of copperPositions) {
      const copper = INIT.initCopper(c[0], c[1], c[2], c[3]);
      APP.scene.add(copper.mesh);
      copperList.push(copper);
    }

    // arrow
    const arrow = new Arrow(new CANNON.Vec3(0, 10, 0));

    // bits
    const bitList = INIT.initBits(2);

    // materials
    const contacts = INIT.initContactMaterials();
    APP.world.addContactMaterial(contacts.groundSphereContactMat);
    APP.world.addContactMaterial(contacts.boxSphereContactMat);
    APP.world.addContactMaterial(contacts.capacitorMat);

    var audio = new Audio('src/components/music/electronic-rock-king-around-here-15045.mp3')
    return {
      groundMesh,
      end_width,
      end_height,
      end_pos,
      sphereMesh,
      sphereBody,
      arrow,
      bitList,
      copperList,
      audio,
    };
  }
}

export default Level;
