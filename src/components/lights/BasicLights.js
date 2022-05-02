import { Group, SpotLight, AmbientLight, HemisphereLight } from "three";

class BasicLights extends Group {
  constructor(...args) {
    // Invoke parent Group() constructor with our args
    super(...args);

    // const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
    const ambi = new AmbientLight(0x404040, 1);
    const hemi = new HemisphereLight(0xffffbb, 0x080820, 1);
    // dir.target.position.set(25, 0, 30);

    this.add(ambi, hemi);
  }
}

export default BasicLights;
