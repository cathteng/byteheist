import * as CANNON from "cannon-es";
import * as INIT from '../../init.js';
import * as APP from "../../app.js";
import { Arrow } from "../objects"

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
        var {groundMesh, groundBody} = INIT.initGround(start_width, start_height, start_depth, start_pos, '#0045AD');
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 50), '#50EE25'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0, 100);

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
        const {boxMesh, boxBody} = INIT.initBox(20, 1, 4, new CANNON.Vec3(0, 2.5, 0));
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
        const resistor = INIT.initResistor();
        APP.scene.add(resistor);
        APP.world.addBody(resistor.body);

        // capacitor
        const capacitor = INIT.initCapacitor();
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);

        // arrow
        const arrow = new Arrow(new CANNON.Vec3(0, 10, 100));

        // bits
        const bitList = INIT.initBits();

        // materials
        const contacts = INIT.initContactMaterials();
        APP.world.addContactMaterial(contacts.groundSphereContactMat);
        APP.world.addContactMaterial(contacts.boxSphereContactMat);
        APP.world.addContactMaterial(contacts.capacitorMat);

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList};
    }
    _levelOne() {
        // resistor
        const resistor = INIT.initResistor();
        APP.scene.add(resistor);
        APP.world.addBody(resistor.body);

        // capacitor
        const capacitor = INIT.initCapacitor();
        APP.scene.add(capacitor);
        APP.world.addBody(capacitor.body);
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
        ({groundMesh, groundBody} = INIT.initGround(100, 40, 0.2, new CANNON.Vec3(0, 0, 50), '#50EE25'));
        groundMeshes.push(groundMesh);
        groundBodies.push(groundBody);
        const end_width = 20;
        const end_height = 20;
        const end_depth = 0.2;
        const end_pos = new CANNON.Vec3(0, 0, 100);

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
        const {boxMesh, boxBody} = INIT.initBox(20, 1, 4, new CANNON.Vec3(0, 2.5, 0));
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

        // arrow
        const arrow = new Arrow(new CANNON.Vec3(0, 10, 100));

        // bits
        const bitList = INIT.initBits();

        // materials
        const contacts = INIT.initContactMaterials();
        APP.world.addContactMaterial(contacts.groundSphereContactMat);
        APP.world.addContactMaterial(contacts.boxSphereContactMat);
        APP.world.addContactMaterial(contacts.capacitorMat);

        return {groundMesh, end_width, end_height, end_pos, sphereMesh, sphereBody, arrow, bitList};
    }
}

export default Level;