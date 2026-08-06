import * as CANNON from 'cannon-es';

export class PhysicsWorld {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.81, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;

    // Contact Materials
    const defaultMaterial = new CANNON.Material('default');
    const groundMaterial = new CANNON.Material('ground');
    const rocketMaterial = new CANNON.Material('rocket');

    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.4
      }
    );
    this.world.addContactMaterial(defaultContactMaterial);

    const rocketGroundContact = new CANNON.ContactMaterial(
      rocketMaterial,
      groundMaterial,
      {
        friction: 0.3,
        restitution: 0.2
      }
    );
    this.world.addContactMaterial(rocketGroundContact);

    this.defaultMaterial = defaultMaterial;
    this.groundMaterial = groundMaterial;
    this.rocketMaterial = rocketMaterial;

    // Ground Plane Body
    const groundShape = new CANNON.Plane();
    this.groundBody = new CANNON.Body({
      mass: 0,
      material: groundMaterial
    });
    this.groundBody.addShape(groundShape);
    this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(this.groundBody);

    this.bodiesToSync = [];
  }

  addDynamicBody(mesh, shape, mass = 1, pos = { x: 0, y: 0, z: 0 }) {
    const body = new CANNON.Body({
      mass: mass,
      material: this.defaultMaterial,
      position: new CANNON.Vec3(pos.x, pos.y, pos.z)
    });
    body.addShape(shape);
    this.world.addBody(body);
    this.bodiesToSync.push({ mesh, body });
    return body;
  }

  addStaticBox(mesh, size, pos = { x: 0, y: 0, z: 0 }, rot = { x: 0, y: 0, z: 0 }) {
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    const body = new CANNON.Body({
      mass: 0,
      material: this.defaultMaterial,
      position: new CANNON.Vec3(pos.x, pos.y, pos.z)
    });
    body.quaternion.setFromEuler(rot.x, rot.y, rot.z);
    body.addShape(shape);
    this.world.addBody(body);
    return body;
  }

  update(deltaTime) {
    this.world.step(1 / 60, deltaTime, 3);
    for (const item of this.bodiesToSync) {
      item.mesh.position.copy(item.body.position);
      item.mesh.quaternion.copy(item.body.quaternion);
    }
  }
}
