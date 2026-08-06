import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { audioEngine } from './Audio.js';

export class Rocket {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;

    // Flight state
    this.thrustPower = 0;
    this.isBoosting = false;
    this.steeringAngle = 0;
    this.pitchAngle = 0;
    this.speed = 0;
    this.altitude = 0;

    // Create 3D Mesh Group
    this.mesh = new THREE.Group();
    this.buildRocketMesh();
    this.scene.add(this.mesh);

    // Physics Body setup
    const radius = 1.2;
    const height = 4.5;
    const shape = new CANNON.Cylinder(radius, radius, height, 8);
    
    this.body = new CANNON.Body({
      mass: 15,
      material: this.physicsWorld.rocketMaterial,
      position: new CANNON.Vec3(0, 3, 0),
      angularDamping: 0.85,
      linearDamping: 0.35
    });

    // Cannon cylinder is aligned along Z, rotate shape to match Y axis
    const q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    this.body.addShape(shape, new CANNON.Vec3(0, 0, 0), q);

    this.physicsWorld.world.addBody(this.body);

    // Particle Exhaust Setup
    this.initExhaustParticles();

    // Inputs state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      pitchUp: false,
      pitchDown: false,
      boost: false,
      brake: false
    };
  }

  buildRocketMesh() {
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1A1528,
      roughness: 0.3,
      metalness: 0.8
    });
    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x9B5DE5,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x7F5AF0,
      emissiveIntensity: 0.2
    });
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00F5D4,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x00F5D4,
      emissiveIntensity: 0.5
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD166,
      roughness: 0.3,
      metalness: 0.9
    });
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.5,
      metalness: 0.9
    });

    // 1. Fuselage Body (Cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.8, 0.9, 3.2, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.mesh.add(bodyMesh);

    // 2. Stripe Rings
    const stripeGeo = new THREE.CylinderGeometry(0.81, 0.81, 0.3, 32);
    const stripeMesh = new THREE.Mesh(stripeGeo, purpleMat);
    stripeMesh.position.y = 0.6;
    this.mesh.add(stripeMesh);

    const stripe2Geo = new THREE.CylinderGeometry(0.81, 0.81, 0.15, 32);
    const stripe2Mesh = new THREE.Mesh(stripe2Geo, cyanMat);
    stripe2Mesh.position.y = -0.4;
    this.mesh.add(stripe2Mesh);

    // 3. Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.8, 1.6, 32);
    const noseMesh = new THREE.Mesh(noseGeo, purpleMat);
    noseMesh.position.y = 2.4;
    noseMesh.castShadow = true;
    this.mesh.add(noseMesh);

    // Nose tip glow
    const tipGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, cyanMat);
    tipMesh.position.y = 3.2;
    this.mesh.add(tipMesh);

    // 4. Payload Module Section
    const payloadGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.4, 32);
    const payloadMesh = new THREE.Mesh(payloadGeo, goldMat);
    payloadMesh.position.y = 1.3;
    this.mesh.add(payloadMesh);

    // 5. Swept Aerodynamic Fins (4 fins)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.9, -0.6);
    finShape.lineTo(0.9, -1.4);
    finShape.lineTo(0, -0.8);
    finShape.closePath();

    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);

    for (let i = 0; i < 4; i++) {
      const finMesh = new THREE.Mesh(finGeo, purpleMat);
      finMesh.rotation.y = (i * Math.PI) / 2;
      finMesh.position.y = -0.5;
      finMesh.castShadow = true;
      this.mesh.add(finMesh);
    }

    // 6. Engine Nozzle & Flame Cone
    const nozzleGeo = new THREE.CylinderGeometry(0.5, 0.65, 0.6, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, engineMat);
    nozzleMesh.position.y = -1.8;
    this.mesh.add(nozzleMesh);

    // Flame Cone Mesh
    const flameGeo = new THREE.ConeGeometry(0.55, 1.8, 16);
    flameGeo.rotateX(Math.PI);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xFF5722,
      transparent: true,
      opacity: 0.85
    });
    this.flameMesh = new THREE.Mesh(flameGeo, flameMat);
    this.flameMesh.position.y = -2.7;
    this.flameMesh.visible = false;
    this.mesh.add(this.flameMesh);

    // Flame Inner Core Glow
    const coreGeo = new THREE.ConeGeometry(0.3, 1.2, 16);
    coreGeo.rotateX(Math.PI);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00F5D4,
      transparent: true,
      opacity: 0.9
    });
    this.flameCore = new THREE.Mesh(coreGeo, coreMat);
    this.flameCore.position.y = -2.4;
    this.flameCore.visible = false;
    this.mesh.add(this.flameCore);

    // Engine Glow Light
    this.thrusterLight = new THREE.PointLight(0xFF7043, 0, 15);
    this.thrusterLight.position.y = -2.2;
    this.mesh.add(this.thrusterLight);
  }

  initExhaustParticles() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const opacity = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100; // hidden initially
      positions[i * 3 + 2] = 0;
      opacity[i] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const textureLoader = new THREE.TextureLoader();
    const particleMat = new THREE.PointsMaterial({
      color: 0x9B5DE5,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, particleMat);
    this.scene.add(this.particles);
    this.particleData = Array.from({ length: particleCount }, () => ({
      life: 0,
      maxLife: 0.4 + Math.random() * 0.4,
      vel: new THREE.Vector3()
    }));
    this.particleIndex = 0;
  }

  updateExhaustParticles(deltaTime) {
    const positions = this.particles.geometry.attributes.position.array;

    // Spawn new particles if engine active
    if (this.thrustPower > 0.05) {
      const spawnCount = this.isBoosting ? 6 : 3;
      const rocketPos = this.mesh.position;
      const rocketQuat = this.mesh.quaternion;

      for (let s = 0; s < spawnCount; s++) {
        const idx = (this.particleIndex++) % this.particleData.length;
        const p = this.particleData[idx];
        p.life = p.maxLife;

        // Offset from rocket nozzle
        const localOffset = new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          -2.2,
          (Math.random() - 0.5) * 0.3
        ).applyQuaternion(rocketQuat);

        positions[idx * 3] = rocketPos.x + localOffset.x;
        positions[idx * 3 + 1] = rocketPos.y + localOffset.y;
        positions[idx * 3 + 2] = rocketPos.z + localOffset.z;

        // Velocity directed backward with spread
        const backDir = new THREE.Vector3(0, -1, 0).applyQuaternion(rocketQuat);
        p.vel.copy(backDir).multiplyScalar(8 + Math.random() * 6);
        p.vel.x += (Math.random() - 0.5) * 2;
        p.vel.z += (Math.random() - 0.5) * 2;
      }
    }

    // Update existing particles
    for (let i = 0; i < this.particleData.length; i++) {
      const p = this.particleData[i];
      if (p.life > 0) {
        p.life -= deltaTime;
        positions[i * 3] += p.vel.x * deltaTime;
        positions[i * 3 + 1] += p.vel.y * deltaTime;
        positions[i * 3 + 2] += p.vel.z * deltaTime;
      } else {
        positions[i * 3 + 1] = -100;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  update(deltaTime) {
    // 1. Process Flight Controls Force
    let targetThrust = 0;
    let turnTorque = 0;
    let pitchTorque = 0;

    if (this.keys.forward) targetThrust = 1.0;
    if (this.keys.backward) targetThrust = -0.3;
    if (this.keys.left) turnTorque = 1.0;
    if (this.keys.right) turnTorque = -1.0;
    if (this.keys.pitchUp) pitchTorque = 1.0;
    if (this.keys.pitchDown) pitchTorque = -1.0;

    this.isBoosting = this.keys.boost;
    const forceMultiplier = this.isBoosting ? 2.2 : 1.0;

    // Smooth thrust ramp
    this.thrustPower += (targetThrust - this.thrustPower) * 10 * deltaTime;
    this.thrustPower = Math.max(-0.3, Math.min(1.0, this.thrustPower));

    // Audio Engine rumble modulation
    audioEngine.setEnginePower(Math.max(0, this.thrustPower) * (this.isBoosting ? 1.5 : 1.0));

    // Apply Cannon physics forces
    const quat = new THREE.Quaternion(
      this.body.quaternion.x,
      this.body.quaternion.y,
      this.body.quaternion.z,
      this.body.quaternion.w
    );

    // Forward vector (Rocket points along local Y axis)
    const forwardDir = new THREE.Vector3(0, 1, 0).applyQuaternion(quat);

    if (Math.abs(this.thrustPower) > 0.01) {
      const forceMagnitude = this.thrustPower * 450 * forceMultiplier;
      const force = new CANNON.Vec3(
        forwardDir.x * forceMagnitude,
        forwardDir.y * forceMagnitude,
        forwardDir.z * forceMagnitude
      );
      this.body.applyForce(force, this.body.position);
    }

    // Steering Yaw torque around Y axis
    if (turnTorque !== 0) {
      const torque = new CANNON.Vec3(0, turnTorque * 35, 0);
      this.body.applyTorque(torque);
    }

    // Pitch torque around X axis
    if (pitchTorque !== 0) {
      const pitchVec = new THREE.Vector3(1, 0, 0).applyQuaternion(quat);
      const torque = new CANNON.Vec3(
        pitchVec.x * pitchTorque * 30,
        pitchVec.y * pitchTorque * 30,
        pitchVec.z * pitchTorque * 30
      );
      this.body.applyTorque(torque);
    }

    // Air brake & upright stabilizer (RCS)
    if (this.keys.brake) {
      this.body.velocity.scale(0.92, this.body.velocity);
      this.body.angularVelocity.scale(0.85, this.body.angularVelocity);
    }

    // Dynamic Upright Flight Stabilizer force (Keeps rocket pointing upright/skyward when flying low)
    const currentUp = new THREE.Vector3(0, 1, 0).applyQuaternion(quat);
    const targetUp = new THREE.Vector3(0, 1, 0);
    const tiltCorrection = new THREE.Vector3().crossVectors(currentUp, targetUp);
    if (tiltCorrection.length() > 0.05) {
      const stabilizationTorque = new CANNON.Vec3(
        tiltCorrection.x * 25,
        tiltCorrection.y * 25,
        tiltCorrection.z * 25
      );
      this.body.applyTorque(stabilizationTorque);
    }

    // Sync Three.js Mesh with Cannon Physics Body
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);

    // Update Flame visuals
    const activeFlame = this.thrustPower > 0.05;
    this.flameMesh.visible = activeFlame;
    this.flameCore.visible = activeFlame;
    if (activeFlame) {
      const scale = (0.8 + Math.sin(Date.now() * 0.03) * 0.2) * (this.isBoosting ? 1.8 : 1.0) * this.thrustPower;
      this.flameMesh.scale.set(scale, scale * (this.isBoosting ? 2.2 : 1.2), scale);
      this.flameCore.scale.set(scale * 0.8, scale * 1.5, scale * 0.8);
      this.thrusterLight.intensity = (2.5 + Math.random() * 1.5) * (this.isBoosting ? 2.5 : 1.0);
      this.thrusterLight.color.setHex(this.isBoosting ? 0x00F5D4 : 0xFF7043);
    } else {
      this.thrusterLight.intensity = 0;
    }

    // Update Telemetry metrics
    const vel = this.body.velocity;
    this.speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
    this.altitude = Math.max(0, this.body.position.y);

    // Update Exhaust Particles
    this.updateExhaustParticles(deltaTime);
  }

  teleportTo(pos) {
    this.body.position.set(pos.x, pos.y, pos.z);
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.setFromEuler(0, 0, 0);
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
