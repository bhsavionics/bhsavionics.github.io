import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SITE_CONTENT } from '../data/siteContent.js';
import { audioEngine } from './Audio.js';

export class StationManager {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;

    this.stations = [];
    this.waypointRings = [];
    this.bowlingPins = [];
    this.interactiveObjects = [];

    this.initStations();
    this.initWaypointRings();
    this.initBowlingPins();
    this.initRamp();
  }

  createCanvasTexture(text, subtitle, badge, color = "#9B5DE5") {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0F0B1A');
    grad.addColorStop(1, '#05030A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Glowing Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.strokeRect(10, 10, 1004, 492);

    // Badge pill
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(60, 40, 240, 44, 22);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(badge, 80, 70);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px system-ui, sans-serif';
    ctx.fillText(text, 60, 170);

    // Subtitle
    ctx.fillStyle = '#A0A0B0';
    ctx.font = '400 24px system-ui, sans-serif';

    // Wrap subtitle
    const words = subtitle.split(' ');
    let line = '';
    let y = 230;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && n > 0) {
        ctx.fillText(line, 60, y);
        line = words[n] + ' ';
        y += 36;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 60, y);

    // Action Prompt
    ctx.fillStyle = color;
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText('▶ FLY NEAR OR LAND TO OPEN DATA MODAL', 60, 440);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  initStations() {
    const stationDefs = [
      {
        id: 'start',
        title: 'BAAP LAUNCH COMPLEX 01',
        subtitle: 'Welcome to Battlefield Aeronautics & Avionics Program',
        badge: 'MISSION CONTROL',
        color: '#00F5D4',
        pos: { x: 0, y: 0, z: 0 },
        modelType: 'launchpad'
      },
      {
        id: 'about',
        title: 'ABOUT BAAP & FLIGHT CREW',
        subtitle: SITE_CONTENT.about.subtitle,
        badge: 'SPACE STATION',
        color: '#9B5DE5',
        pos: { x: -70, y: 0, z: -60 },
        modelType: 'spacestation'
      },
      {
        id: 'timeline',
        title: 'MISSION LOGS & TIMELINE',
        subtitle: SITE_CONTENT.timeline.subtitle,
        badge: 'OBSERVATORY',
        color: '#00F5D4',
        pos: { x: 70, y: 0, z: -80 },
        modelType: 'observatory'
      },
      {
        id: 'resources',
        title: 'TECH LAB & CAD REPOSITORY',
        subtitle: SITE_CONTENT.resources.subtitle,
        badge: 'HARDWARE LAB',
        color: '#F15BB5',
        pos: { x: 80, y: 0, z: 50 },
        modelType: 'lab'
      },
      {
        id: 'gallery',
        title: 'MISSION PHOTO GALLERY',
        subtitle: SITE_CONTENT.gallery.subtitle,
        badge: 'VISUAL HANGAR',
        color: '#FEE440',
        pos: { x: -80, y: 0, z: 60 },
        modelType: 'gallery'
      },
      {
        id: 'merch',
        title: 'BAAP FLIGHT CREW MERCH',
        subtitle: SITE_CONTENT.merch.subtitle,
        badge: 'MERCH OUTPOST',
        color: '#9B5DE5',
        pos: { x: 0, y: 0, z: -130 },
        modelType: 'merch'
      },
      {
        id: 'blog',
        title: 'AEROSPACE BLOG & NEWS',
        subtitle: SITE_CONTENT.blog.subtitle,
        badge: 'SATELLITE RELAY',
        color: '#00F5D4',
        pos: { x: 0, y: 0, z: 120 },
        modelType: 'satellite'
      }
    ];

    for (const def of stationDefs) {
      this.buildStation(def);
    }
  }

  buildStation(def) {
    const group = new THREE.Group();
    group.position.set(def.pos.x, def.pos.y, def.pos.z);

    // 1. Landing Helipad Base
    const padGeo = new THREE.CylinderGeometry(14, 15, 1.2, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x12101F,
      metalness: 0.8,
      roughness: 0.2
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = 0.6;
    padMesh.receiveShadow = true;
    group.add(padMesh);

    // Neon Glow Ring on Pad
    const ringGeo = new THREE.RingGeometry(11, 12.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(def.color),
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 1.25;
    group.add(ringMesh);

    // 2. 3D Billboard Sign
    const tex = this.createCanvasTexture(def.title, def.subtitle, def.badge, def.color);
    const boardGeo = new THREE.PlaneGeometry(16, 8);
    const boardMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.position.set(0, 10, -10);
    group.add(boardMesh);

    // Billboard Support Structure
    const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.position.set(-7, 5, -10);
    group.add(pole1);
    const pole2 = new THREE.Mesh(poleGeo, poleMat);
    pole2.position.set(7, 5, -10);
    group.add(pole2);

    // 3. Station Structure Model
    const modelGroup = new THREE.Group();
    if (def.modelType === 'launchpad') {
      // Launch Gantry Tower
      const towerGeo = new THREE.BoxGeometry(3, 24, 3);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x444455, wireframe: true });
      const towerMesh = new THREE.Mesh(towerGeo, towerMat);
      towerMesh.position.set(-10, 12, 0);
      modelGroup.add(towerMesh);
    } else if (def.modelType === 'observatory') {
      // Dome
      const domeGeo = new THREE.SphereGeometry(6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x2A2640, metalness: 0.9 });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.set(0, 6, 0);
      modelGroup.add(domeMesh);
    } else if (def.modelType === 'spacestation') {
      // Solar Panel Wings
      const wingGeo = new THREE.BoxGeometry(20, 0.2, 4);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x00F5D4, emissive: 0x00F5D4, emissiveIntensity: 0.3 });
      const wingMesh = new THREE.Mesh(wingGeo, wingMat);
      wingMesh.position.set(0, 8, 0);
      modelGroup.add(wingMesh);
    } else {
      // Generic Futuristic Module
      const modGeo = new THREE.CylinderGeometry(5, 6, 8, 8);
      const modMat = new THREE.MeshStandardMaterial({ color: 0x221F33, metalness: 0.8 });
      const modMesh = new THREE.Mesh(modGeo, modMat);
      modMesh.position.set(0, 4, 0);
      modelGroup.add(modMesh);
    }
    group.add(modelGroup);

    // Point light for station ambiance
    const light = new THREE.PointLight(new THREE.Color(def.color), 3, 25);
    light.position.set(0, 6, 0);
    group.add(light);

    // Special: Floating Photo Gallery Frames for Gallery Station
    if (def.id === 'gallery') {
      this.buildPhotoGalleryFrames(group);
    }

    this.scene.add(group);

    // Physics static cylinder for pad
    this.physicsWorld.addStaticBox(
      padMesh,
      { x: 28, y: 1.2, z: 28 },
      { x: def.pos.x, y: 0.6, z: def.pos.z }
    );

    this.stations.push({
      id: def.id,
      title: def.title,
      badge: def.badge,
      pos: def.pos,
      radius: 18,
      group
    });
  }

  buildPhotoGalleryFrames(parentGroup) {
    const loader = new THREE.TextureLoader();
    const photos = SITE_CONTENT.gallery.photos;
    
    photos.forEach((photo, idx) => {
      const angle = (idx / photos.length) * Math.PI * 1.5 - Math.PI * 0.75;
      const radius = 18;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 5;

      const frameGeo = new THREE.BoxGeometry(4.5, 3.2, 0.2);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.set(x, 4.5, z);
      frameMesh.rotation.y = -angle + Math.PI / 2;

      // Photo Texture
      loader.load(photo.image, (texture) => {
        const photoGeo = new THREE.PlaneGeometry(4.2, 2.9);
        const photoMat = new THREE.MeshBasicMaterial({ map: texture });
        const photoMesh = new THREE.Mesh(photoGeo, photoMat);
        photoMesh.position.z = 0.12;
        frameMesh.add(photoMesh);
      });

      parentGroup.add(frameMesh);
    });
  }

  initWaypointRings() {
    const ringPositions = [
      { x: 0, y: 15, z: -40 },
      { x: -35, y: 20, z: -30 },
      { x: 35, y: 22, z: -40 },
      { x: 40, y: 18, z: 20 },
      { x: -40, y: 25, z: 20 },
      { x: 0, y: 30, z: 60 }
    ];

    const torusGeo = new THREE.TorusGeometry(5, 0.4, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00F5D4 });

    ringPositions.forEach((pos, idx) => {
      const ringMesh = new THREE.Mesh(torusGeo, ringMat);
      ringMesh.position.set(pos.x, pos.y, pos.z);
      this.scene.add(ringMesh);

      this.waypointRings.push({
        mesh: ringMesh,
        pos,
        radius: 5.5,
        passed: false,
        idx
      });
    });
  }

  initBowlingPins() {
    // 6 Physics Bowling Pins
    const pinGeo = new THREE.CylinderGeometry(0.4, 0.8, 2.5, 16);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });

    const pinShape = new CANNON.Cylinder(0.4, 0.8, 2.5, 16);

    const startX = 30;
    const startZ = 20;

    let pinIdx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c <= r; c++) {
        const x = startX + (c - r * 0.5) * 2;
        const z = startZ - r * 2.2;

        const mesh = new THREE.Mesh(pinGeo, pinMat);
        mesh.castShadow = true;
        this.scene.add(mesh);

        const body = this.physicsWorld.addDynamicBody(mesh, pinShape, 2.0, { x, y: 1.5, z });
        this.bowlingPins.push({ mesh, body });
      }
    }
  }

  initRamp() {
    // Jump Ramp for Rocket
    const rampGeo = new THREE.BoxGeometry(10, 4, 16);
    const rampMat = new THREE.MeshStandardMaterial({ color: 0x9B5DE5, metalness: 0.8 });
    const rampMesh = new THREE.Mesh(rampGeo, rampMat);
    rampMesh.position.set(-30, 1.5, -20);
    rampMesh.rotation.x = -Math.PI / 10;
    this.scene.add(rampMesh);

    this.physicsWorld.addStaticBox(
      rampMesh,
      { x: 10, y: 4, z: 16 },
      { x: -30, y: 1.5, z: -20 },
      { x: -Math.PI / 10, y: 0, z: 0 }
    );
  }

  update(rocketPos) {
    // 1. Check Station Proximity
    let activeStation = null;
    for (const station of this.stations) {
      const dx = rocketPos.x - station.pos.x;
      const dz = rocketPos.z - station.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < station.radius) {
        activeStation = station;
        break;
      }
    }

    // 2. Animate Waypoint Rings & Check Ring Passes
    this.waypointRings.forEach(ring => {
      ring.mesh.rotation.y += 0.02;
      const dx = rocketPos.x - ring.pos.x;
      const dy = rocketPos.y - ring.pos.y;
      const dz = rocketPos.z - ring.pos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < ring.radius && !ring.passed) {
        ring.passed = true;
        ring.mesh.material.color.setHex(0xFFD166);
        audioEngine.playRingChime();
        setTimeout(() => {
          ring.passed = false;
          ring.mesh.material.color.setHex(0x00F5D4);
        }, 5000);
      }
    });

    return activeStation;
  }
}
