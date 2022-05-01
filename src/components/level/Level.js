import * as CANNON from "cannon-es";
import * as INIT from '../../init.js';
import * as APP from "../../app.js";
import { Arrow } from "../objects";
import * as THREE from 'three';

class Level {
    constructor(totalLevels) {
        this.currentLevel = 0;
        this.maxLevels = totalLevels;
        this.functions = {0: this._levelZero, 1: this._levelOne};

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
        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 50), '#50EE25'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 100), '#50EE25'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);

        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 150), '#50EE25'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);


        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0, 200);

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
        var {sphereMesh, sphereBody} = INIT.initSphere();
        APP.scene.add(sphereMesh);
        APP.world.addBody(sphereBody);

        // resistor
        var resistor1 = INIT.initResistor(new THREE.Vector3(15, 0, 100));
        APP.scene.add(resistor1);
        APP.world.addBody(resistor1.body);

        var resistor2 = INIT.initResistor(new THREE.Vector3(0, 0, 100));
        APP.scene.add(resistor2);
        APP.world.addBody(resistor2.body);

        var resistor3 = INIT.initResistor(new THREE.Vector3(-15, 0, 100));
        APP.scene.add(resistor3);
        APP.world.addBody(resistor3.body);

        var resistor4 = INIT.initResistor(new THREE.Vector3(-30, 0, 100));
        APP.scene.add(resistor4);
        APP.world.addBody(resistor4.body);

        var resistor5 = INIT.initResistor(new THREE.Vector3(30, 0, 100));
        APP.scene.add(resistor5);
        APP.world.addBody(resistor5.body);

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

        // arrow
        const arrow = new Arrow(new CANNON.Vec3(0, 10, 200));

        // bits
        const bitList = INIT.initBits(0);

        // materials
        const contacts = INIT.initContactMaterials();
        APP.world.addContactMaterial(contacts.groundSphereContactMat);
        APP.world.addContactMaterial(contacts.boxSphereContactMat);
        APP.world.addContactMaterial(contacts.capacitorMat);

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList};
    }
    _levelOne() {
 
        // ground
        const groundMeshes = [];
        const groundBodies = [];
        const boxMeshes = [];
        const boxBodies = [];

        const start_width = 100;
        const start_height = 40;
        const start_depth = 0.2;
        const start_pos = new CANNON.Vec3(0, 0, 0);
        var {groundMesh, groundBody} = INIT.initGround(start_width, start_height, start_depth, start_pos, '#EE7700');
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        ({groundMesh, groundBody} = INIT.initGround(100, 500, 0.2, new CANNON.Vec3(0, 0, 275), '#50EE25'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0, 550);

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
        var {boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 50), '#E5D449');
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 100), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 150), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 200), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 250), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 300), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 350), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 400), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        ({boxMesh, boxBody} = INIT.initBox(100, 1, 4, new CANNON.Vec3(0, 2.5, 450), '#E5D449'));
        boxMeshes.push(boxMesh);
        boxBodies.push(boxBody);

        for (let i = 0; i < boxMeshes.length; i++) {
            APP.scene.add(boxMeshes[i]);
            APP.world.addBody(boxBodies[i]);
            boxMeshes[i].position.copy(boxBodies[i].position);
            boxMeshes[i].quaternion.copy(boxBodies[i].quaternion);
        }

        // sphere
        var {sphereMesh, sphereBody} = INIT.initSphere();
        APP.scene.add(sphereMesh);
        APP.world.addBody(sphereBody);

        // resistor
        // const resistor = INIT.initResistor();
        // APP.scene.add(resistor);
        // APP.world.addBody(resistor.body);

        // // capacitor
        // const capacitor = INIT.initCapacitor();
        // APP.scene.add(capacitor);
        // APP.world.addBody(capacitor.body);

        // arrow
        const arrow = new Arrow(new CANNON.Vec3(0, 10, 100));

        // bits
        const bitList = INIT.initBits(1);

        // materials
        const contacts = INIT.initContactMaterials();
        APP.world.addContactMaterial(contacts.groundSphereContactMat);
        APP.world.addContactMaterial(contacts.boxSphereContactMat);
        APP.world.addContactMaterial(contacts.capacitorMat);

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList};
    }
}

export default Level;