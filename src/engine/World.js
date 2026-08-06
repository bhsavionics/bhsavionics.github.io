import * as THREE from 'three';
import { PhysicsWorld } from './Physics.js';
import { Rocket } from './Rocket.js';
import { StationManager } from './Stations.js';

export class World {
  constructor(canvas) {
    this.canvas = canvas;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 2. Scene & Fog Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05030A);
    this.scene.fog = new THREE.FogExp2(0x05030A, 0.0035);

    // 3. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8, 20);

    // 4. Physics World & Rocket
    this.physics = new PhysicsWorld();
    this.rocket = new Rocket(this.scene, this.physics);

    // 5. Station & Landmarks Manager
    this.stations = new StationManager(this.scene, this.physics);

    // 6. Environment & Lighting
    this.initLighting();
    this.initStarfield();
    this.initTerrainGrid();

    // Resize Handler
    window.addEventListener('resize', () => this.onWindowResize());

    // Clock
    this.clock = new THREE.Clock();
    this.activeStation = null;

    // Callback for UI active station updates
    this.onStationChange = null;
  }

  initLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x2A2040, 1.2);
    this.scene.add(ambientLight);

    // Directional Main Sunlight with Shadows
    this.dirLight = new THREE.DirectionalLight(0xA770EF, 2.5);
    this.dirLight.position.set(50, 80, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 300;
    const d = 120;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    // Secondary Accent Light (Cyan Space Glow)
    const accentLight = new THREE.DirectionalLight(0x00F5D4, 1.0);
    accentLight.position.set(-50, 40, -50);
    this.scene.add(accentLight);
  }

  initStarfield() {
    const starCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xFFFFFF),
      new THREE.Color(0x9B5DE5),
      new THREE.Color(0x00F5D4),
      new THREE.Color(0xFFD166)
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 300 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  }

  initTerrainGrid() {
    // Ground Plane with Neon Grid
    const size = 600;
    const divisions = 80;

    const gridHelper = new THREE.GridHelper(size, divisions, 0x9B5DE5, 0x1E1A33);
    gridHelper.position.y = 0.05;
    this.scene.add(gridHelper);

    // Dark Ground Surface
    const groundGeo = new THREE.PlaneGeometry(size, size);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x080512,
      roughness: 0.8,
      metalness: 0.2
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
  }

  updateCamera() {
    // Smooth Follow Camera behind Rocket
    const rocketPos = this.rocket.mesh.position;
    const rocketQuat = this.rocket.mesh.quaternion;

    // Ideal camera offset behind & above rocket
    const offset = new THREE.Vector3(0, 7, -18).applyQuaternion(rocketQuat);
    const idealCameraPos = rocketPos.clone().add(offset);

    // Look at point ahead of rocket
    const targetLookAt = rocketPos.clone().add(
      new THREE.Vector3(0, 3, 10).applyQuaternion(rocketQuat)
    );

    // Smooth Lerp Camera Position
    this.camera.position.lerp(idealCameraPos, 0.08);
    this.camera.lookAt(targetLookAt);
  }

  startRenderLoop() {
    const loop = () => {
      requestAnimationFrame(loop);

      const deltaTime = Math.min(this.clock.getDelta(), 0.1);

      // 1. Update Physics
      this.physics.update(deltaTime);

      // 2. Update Rocket Flight
      this.rocket.update(deltaTime);

      // 3. Update Camera Trailing
      this.updateCamera();

      // 4. Update Stations Proximity
      const currentStation = this.stations.update(this.rocket.mesh.position);
      if (currentStation !== this.activeStation) {
        this.activeStation = currentStation;
        if (this.onStationChange) {
          this.onStationChange(this.activeStation);
        }
      }

      // 5. Starfield subtle rotation
      if (this.starfield) {
        this.starfield.rotation.y += 0.0002;
      }

      // 6. Render WebGL
      this.renderer.render(this.scene, this.camera);
    };

    loop();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
