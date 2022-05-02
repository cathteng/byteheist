import * as CANNON from "cannon-es";
import * as INIT from '../../init.js';
import * as APP from "../../app.js";
import { Arrow } from "../objects";
import * as THREE from 'three';

class Level {
    constructor(totalLevels) {
        this.currentLevel = 0;
        this.maxLevels = totalLevels;
        this.functions = {0: this._levelZero, 1: this._levelOne, 2: this._levelTwo};

    }
    changeLevel(level) {
        this.currentLevel = level;
        return this.functions[level]();
    }
    _levelZero() {
        // ground
        const groundMeshes = [];
        const groundBodies = [];
        const boxMeshes = [];
        const boxBodies = [];

        const start_width = 100;
        const start_height = 40;
        const start_depth = 0.2;
        const start_pos = new CANNON.Vec3(0, 0, 0);
        //start platform
        var {groundMesh, groundBody} = INIT.initGround(start_width, start_height, start_depth, start_pos, '#0045AD');
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);


        // middle platforms
        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 50), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 100), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 150), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 200), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);


        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0, 250);

        //end platform
        ({groundMesh, groundBody} = INIT.initGround(end_width, end_height, end_depth, end_pos, '#FFD700'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        for (let i = 0; i < groundMeshes.length; i++) {
            APP.scene.add(groundMeshes[i]);
            APP.world.addBody(groundBodies[i]);
            groundMeshes[i].position.copy(groundBodies[i].position);
            groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
        }

        // box
        // const {boxMesh, boxBody} = INIT.initBox(20, 1, 4, new CANNON.Vec3(0, 2.5, 0), '#E5D449');
        // boxMeshes.push(boxMesh);
        // boxBodies.push(boxBody);
        // for (let i = 0; i < boxMeshes.length; i++) {
        //     APP.scene.add(boxMeshes[i]);
        //     APP.world.addBody(boxBodies[i]);
        //     boxMeshes[i].position.copy(boxBodies[i].position);
        //     boxMeshes[i].quaternion.copy(boxBodies[i].quaternion);
        // }

        // sphere
        var {sphereMesh, sphereBody} = INIT.initSphere(new CANNON.Vec3(0, 10, 0));
        APP.scene.add(sphereMesh);
        APP.world.addBody(sphereBody);

        // resistor
        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(0, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-30, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(30, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        // capacitor
        const capacitor1 = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 150)); // 
        APP.scene.add(capacitor1);
        APP.world.addBody(capacitor1.body);

        const capacitor2 = INIT.initCapacitor(new THREE.Vector3(-30, 2.5, 150)); // 
        APP.scene.add(capacitor2);
        APP.world.addBody(capacitor2.body);

        const capacitor3 = INIT.initCapacitor(new THREE.Vector3(30, 2.5, 150)); // 
        APP.scene.add(capacitor3);
        APP.world.addBody(capacitor3.body);

        //copper
        const copperList = [];
        const copper1 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 210), 1, 20, 1);
        APP.scene.add(copper1.mesh);
        copperList.push(copper1);

        const copper2 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 205), 1, 20, 1);
        APP.scene.add(copper2.mesh);
        copperList.push(copper2);

        const copper3 = INIT.initCopper(new THREE.Vector3(20, 0.5, 210), 1, 20, 1);
        APP.scene.add(copper3.mesh);
        copperList.push(copper3);

        const copper4 = INIT.initCopper(new THREE.Vector3(20, 0.5, 205), 1, 20, 1);
        APP.scene.add(copper4.mesh);
        copperList.push(copper4);
        // 
        const copper5 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 200), 1, 20, 1);
        APP.scene.add(copper5.mesh);
        copperList.push(copper5);

        const copper6 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 195), 1, 20, 1);
        APP.scene.add(copper6.mesh);
        copperList.push(copper6);

        const copper7 = INIT.initCopper(new THREE.Vector3(20, 0.5, 200), 1, 20, 1);
        APP.scene.add(copper7.mesh);
        copperList.push(copper7);

        const copper8 = INIT.initCopper(new THREE.Vector3(20, 0.5, 195), 1, 20, 1);
        APP.scene.add(copper8.mesh);
        copperList.push(copper8);

        // arrow
        const arrow = new Arrow(new CANNON.Vec3(0, 10, 250));

        // bits
        const bitList = INIT.initBits(0);

        // materials
        const contacts = INIT.initContactMaterials();
        APP.world.addContactMaterial(contacts.groundSphereContactMat);
        APP.world.addContactMaterial(contacts.boxSphereContactMat);
        APP.world.addContactMaterial(contacts.capacitorMat);

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList, copperList};
    }
    _levelOne() {
 
        // ground
        const groundMeshes = [];
        const groundBodies = [];
        const boxMeshes = [];
        const boxBodies = [];
        const copperList =[];

        const sphere_start = new CANNON.Vec3(0, 10, 0);

        const start_width = 100;
        const start_height = 40;
        const start_depth = 0.2;
        const start_pos = new CANNON.Vec3(0, 0, 0);
        var {groundMesh, groundBody} = INIT.initGround(start_width, start_height, start_depth, start_pos, '#EE7700');
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        ({groundMesh, groundBody} = INIT.initGround(100, 500, 0.2, new CANNON.Vec3(0, 0, 275), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0.01, 500);

        ({groundMesh, groundBody} = INIT.initGround(end_width, end_height, end_depth, end_pos, '#FFD700'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        for (let i = 0; i < groundMeshes.length; i++) {
            APP.scene.add(groundMeshes[i]);
            APP.world.addBody(groundBodies[i]);
            groundMeshes[i].position.copy(groundBodies[i].position);
            groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
        }

        // box
        // wall 1
        var {boxMesh, boxBody} = INIT.initBox(50, 1, 15, new CANNON.Vec3(25, 7.5, 50), '#E5D449');
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(30, 1, 15, new CANNON.Vec3(-25, 7.5, 50), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(10, 0, 75), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-40, 0, 75), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        const capacitor1 = INIT.initCapacitor(new THREE.Vector3(40, 2.5, 75)); // 
        APP.scene.add(capacitor1);
        APP.world.addBody(capacitor1.body);

        // wall 2
        ({boxMesh, boxBody} = INIT.initBox(80, 1, 15, new CANNON.Vec3(-10, 7.5, 100), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(45, 7.5, 100), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        const capacitor2 = INIT.initCapacitor(new THREE.Vector3(-25, 2.5, 110)); // 
        APP.scene.add(capacitor2);
        APP.world.addBody(capacitor2.body);

        const capacitor3 = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 125)); // 
        APP.scene.add(capacitor3);
        APP.world.addBody(capacitor3.body);

        const capacitor4 = INIT.initCapacitor(new THREE.Vector3(25, 2.5, 140)); // 
        APP.scene.add(capacitor4);
        APP.world.addBody(capacitor4.body);

        // wall 3
        ({boxMesh, boxBody} = INIT.initBox(60, 1, 15, new CANNON.Vec3(20, 7.5, 150), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(10, 0, 165), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor4 = INIT.initResistor(new THREE.Vector3(20, 0, 165), 3);
        APP.scene.add(resistor4);
        resistor4.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(30, 0, 165), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(40, 0, 165), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        const capacitor5 = INIT.initCapacitor(new THREE.Vector3(-25, 2.5, 175)); // 
        APP.scene.add(capacitor5);
        APP.world.addBody(capacitor5.body);


        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-25, 7.5, 150), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-45, 7.5, 150), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        // wall 4
        ({boxMesh, boxBody} = INIT.initBox(70, 1, 15, new CANNON.Vec3(0, 7.5, 200), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(45, 7.5, 200), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-45, 7.5, 200), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        const copper1 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 210), 2, 20, 1)
        APP.scene.add(copper1.mesh);
        copperList.push(copper1);

        const copper2 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 220), 2, 20, 1)
        APP.scene.add(copper2.mesh);
        copperList.push(copper2);

        const copper3 = INIT.initCopper(new THREE.Vector3(20, 0.5, 210), 2, 20, 1)
        APP.scene.add(copper3.mesh);
        copperList.push(copper3);

        const copper4 = INIT.initCopper(new THREE.Vector3(20, 0.5, 220), 2, 20, 1)
        APP.scene.add(copper4.mesh);
        copperList.push(copper4);
        //
        const copper5 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 230), 2, 20, 1)
        APP.scene.add(copper5.mesh);
        copperList.push(copper5);

        const copper6 = INIT.initCopper(new THREE.Vector3(-20, 0.5, 240), 2, 20, 1)
        APP.scene.add(copper6.mesh);
        copperList.push(copper6);

        const copper7 = INIT.initCopper(new THREE.Vector3(20, 0.5, 230), 2, 20, 1)
        APP.scene.add(copper7.mesh);
        copperList.push(copper7);

        const copper8 = INIT.initCopper(new THREE.Vector3(20, 0.5, 240), 2, 20, 1)
        APP.scene.add(copper8.mesh);
        copperList.push(copper8);

        


        // wall 5
        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-45, 7.5, 250), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(-45, 0, 275), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-22.5, 7.5, 250), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(-22.5, 0, 275), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(0, 7.5, 250), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(0, 0, 275), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(22.5, 7.5, 250), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(22.5, 0, 275), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(45, 7.5, 250), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var resistor = INIT.initResistor(new THREE.Vector3(45, 0, 275), 3);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);



        // wall 6
        ({boxMesh, boxBody} = INIT.initBox(90, 1, 15, new CANNON.Vec3(0, 7.5, 300), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-10, 2.5, 325)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(10, 2.5, 325)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 315)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 335)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);




        //wall 7 
        ({boxMesh, boxBody} = INIT.initBox(40, 1, 15, new CANNON.Vec3(0, 7.5, 350), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(20, 1, 15, new CANNON.Vec3(-40, 7.5, 350), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(20, 1, 15, new CANNON.Vec3(40, 7.5, 350), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        const copper9 = INIT.initCopper(new THREE.Vector3(0, 0.5, 375), 50, 2, 1)
        APP.scene.add(copper9.mesh);
        copperList.push(copper9);

        const copper10 = INIT.initCopper(new THREE.Vector3(-41, 0.5, 375), 50, 2, 1)
        APP.scene.add(copper10.mesh);
        copperList.push(copper10);

        const copper11 = INIT.initCopper(new THREE.Vector3(41, 0.5, 375), 50, 2, 1)
        APP.scene.add(copper11.mesh);
        copperList.push(copper11);



        // wall 8
        ({boxMesh, boxBody} = INIT.initBox(60, 1, 15, new CANNON.Vec3(20, 7.5, 400), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-25, 7.5, 400), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(-45, 7.5, 400), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(30, 2.5, 410)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(20, 2.5, 420)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(10, 2.5, 430)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 440)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-10, 2.5, 430)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-20, 2.5, 420)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-30, 2.5, 410)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);


        
        // wall 9
        ({boxMesh, boxBody} = INIT.initBox(80, 1, 15, new CANNON.Vec3(-10, 7.5, 450), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(10, 1, 15, new CANNON.Vec3(45, 7.5, 450), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        for (let i = 0; i < boxMeshes.length; i++) {
            APP.scene.add(boxMeshes[i]);
            APP.world.addBody(boxBodies[i]);
            boxMeshes[i].position.copy(boxBodies[i].position);
            boxMeshes[i].quaternion.copy(boxBodies[i].quaternion);
        }

        // sphere
        var {sphereMesh, sphereBody} = INIT.initSphere(sphere_start);
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

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList, copperList};
    }

    _levelTwo() {
 
        // ground
        const groundMeshes = [];
        const groundBodies = [];
        const boxMeshes = [];
        const boxBodies = [];

        const start_width = 40;
        const start_height = 40;
        const start_depth = 0.2;
        const start_pos = new CANNON.Vec3(0, 0, 0);
        var {groundMesh, groundBody} = INIT.initGround(start_width, start_height, start_depth, start_pos, '#EE7700');
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        // main halls
        ({groundMesh, groundBody} = INIT.initGround(40, 200, 0.2, new CANNON.Vec3(0, 0, 125), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(200, 40, 0.2, new CANNON.Vec3(-125, 0, 0), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(40, 200, 0.2, new CANNON.Vec3(0, 0, -125), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(200, 40, 0.2, new CANNON.Vec3(125, 0, 0), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        // outline
        //vert
        ({groundMesh, groundBody} = INIT.initGround(40, 200, 0.2, new CANNON.Vec3(-205, 0, -125), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(40, 200, 0.2, new CANNON.Vec3(-205, 0, 125), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(40, 200, 0.2, new CANNON.Vec3(205, 0, -125), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(40, 200, 0.2, new CANNON.Vec3(205, 0, 125), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        //horizontal

        ({groundMesh, groundBody} = INIT.initGround(200, 40, 0.2, new CANNON.Vec3(125, 0, -205), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        
        ({groundMesh, groundBody} = INIT.initGround(200, 40, 0.2, new CANNON.Vec3(-125, 0, -205), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(200, 40, 0.2, new CANNON.Vec3(125, 0, 205), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(200, 40, 0.2, new CANNON.Vec3(-125, 0, 205), '#006F27'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);


        // end platform
        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0.01, 0);

        ({groundMesh, groundBody} = INIT.initGround(end_width, end_height, end_depth, end_pos, '#FFD700'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        for (let i = 0; i < groundMeshes.length; i++) {
            APP.scene.add(groundMeshes[i]);
            APP.world.addBody(groundBodies[i]);
            groundMeshes[i].position.copy(groundBodies[i].position);
            groundMeshes[i].quaternion.copy(groundBodies[i].quaternion);
        }

        

        // for (let i = 0; i < boxMeshes.length; i++) {
        //     APP.scene.add(boxMeshes[i]);
        //     APP.world.addBody(boxBodies[i]);
        //     boxMeshes[i].position.copy(boxBodies[i].position);
        //     boxMeshes[i].quaternion.copy(boxBodies[i].quaternion);
        // }

        // sphere
        var {sphereMesh, sphereBody} = INIT.initSphere(new CANNON.Vec3(0, 10, 0));
        APP.scene.add(sphereMesh);
        APP.world.addBody(sphereBody);

        // resistor
        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, 160), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, 160), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, 100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, 40), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, 40), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);
        //
        var resistor = INIT.initResistor(new THREE.Vector3(-45, 0, 190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-45, 0, 220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-105, 0, 190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-105, 0, 220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-165, 0, 190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-165, 0, 220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(45, 0, 190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(45, 0, 220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(105, 0, 190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(105, 0, 220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(165, 0, 190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(165, 0, 220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);
        //
        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, -160), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, -160), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, -100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, -100), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(15, 0, -40), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-15, 0, -40), 1);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);
        //
        var resistor = INIT.initResistor(new THREE.Vector3(-45, 0, -190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-45, 0, -220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-105, 0, -190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-105, 0, -220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-165, 0, -190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(-165, 0, -220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(45, 0, -190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(45, 0, -220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(105, 0, -190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(105, 0, -220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(165, 0, -190), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);

        var resistor = INIT.initResistor(new THREE.Vector3(165, 0, -220), 2);
        APP.scene.add(resistor);
        resistor.addBodies(APP.world);
        


        // // capacitor
        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 130)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, 70)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, -130)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(0, 2.5, -70)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);
        //
        var capacitor = INIT.initCapacitor(new THREE.Vector3(135, 2.5, -205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(75, 2.5, -205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(135, 2.5, 205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(75, 2.5, 205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-135, 2.5, -205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-75, 2.5, -205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-135, 2.5, 205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-75, 2.5, 205)); // 
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        //
        var capacitor = INIT.initCapacitor(new THREE.Vector3(-160, 2.5, 15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-160, 2.5, -15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-100, 2.5, 15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-100, 2.5, -15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-40, 2.5, 15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-40, 2.5, -15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);
        //
        var capacitor = INIT.initCapacitor(new THREE.Vector3(160, 2.5, 15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(160, 2.5, -15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(100, 2.5, 15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(100, 2.5, -15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(40, 2.5, 15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(40, 2.5, -15), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        //

        var capacitor = INIT.initCapacitor(new THREE.Vector3(190, 2.5, 160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(220, 2.5, 160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(190, 2.5, 100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(220, 2.5, 100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(190, 2.5, 40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(220, 2.5, 40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        //

        var capacitor = INIT.initCapacitor(new THREE.Vector3(190, 2.5, -160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(220, 2.5, -160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(190, 2.5, -100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(220, 2.5, -100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(190, 2.5, -40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(220, 2.5, -40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        //
        var capacitor = INIT.initCapacitor(new THREE.Vector3(-190, 2.5, 160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-220, 2.5, 160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-190, 2.5, 100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-220, 2.5, 100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-190, 2.5, 40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-220, 2.5, 40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        //

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-190, 2.5, -160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-220, 2.5, -160), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-190, 2.5, -100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-220, 2.5, -100), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-190, 2.5, -40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        var capacitor = INIT.initCapacitor(new THREE.Vector3(-220, 2.5, -40), 2);
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);


        //copper
        const copperList = [];
        var copper = INIT.initCopper(new THREE.Vector3(40, 0.5, 0), 20, 1, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(100, 0.5, 0), 20, 1, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(160, 0.5, 0), 20, 1, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-40, 0.5, 0), 20, 1, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-100, 0.5, 0), 20, 1, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-160, 0.5, 0), 20, 1, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        //
        var copper = INIT.initCopper(new THREE.Vector3(205, 0.5, 40), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(205, 0.5, 100), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(205, 0.5, 160), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(205, 0.5, -40), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(205, 0.5, -100), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(205, 0.5, -160), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        //

        var copper = INIT.initCopper(new THREE.Vector3(-205, 0.5, 40), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-205, 0.5, 100), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-205, 0.5, 160), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-205, 0.5, -40), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-205, 0.5, -100), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);

        var copper = INIT.initCopper(new THREE.Vector3(-205, 0.5, -160), 1, 20, 1)
        APP.scene.add(copper.mesh);
        copperList.push(copper);



        // var copper = INIT.initCopper(new THREE.Vector3(50, 0, -50), 10, 10, 10)
        // APP.scene.add(copper.mesh);
        // copperList.push(copper);
        //debugger;
        //APP.world.addBody(copper1.body);
        


        // arrow
        const arrow = new Arrow(new CANNON.Vec3(0, 10, 0));

        // bits
        const bitList = INIT.initBits(2);

        // materials
        const contacts = INIT.initContactMaterials();
        APP.world.addContactMaterial(contacts.groundSphereContactMat);
        APP.world.addContactMaterial(contacts.boxSphereContactMat);
        APP.world.addContactMaterial(contacts.capacitorMat);

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList, copperList};
    }
}

export default Level;