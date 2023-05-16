import * as Three from "three";
import './style.css';

let scene;
let camera;
let renderer;
let cameraX = 0;
let cameraY = 0;
let cameraZ = 50;
const objects = [];
const loader = new Three.TextureLoader();

function init() {
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(cameraX, cameraY, cameraZ);
  // camera.lookAt(0, 0, 0);
  renderer = new Three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const light = new Three.AmbientLight(0xffffff, 0.1);
  scene.add(light);
  document.body.appendChild(renderer.domElement);
}

function addObjects() {
  const geometry = new Three.SphereGeometry(1);

  const solarSystem = new Three.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  {
    const sunMaterial = new Three.MeshPhongMaterial({
      emissive: 0xffff00,
      map: loader.load("./sunsrf.jpg"),
    });
    const sunMesh = new Three.Mesh(geometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    objects.push(sunMesh);
  }
  {
    const pointLight = new Three.PointLight(0xffffff, 3);
    scene.add(pointLight);
  }
  {
    const earthOrbitGeometry = new Three.RingGeometry(9.95, 10.05, 200);
    const earthOrbitMesh = new Three.Mesh(earthOrbitGeometry, new Three.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000}))
    solarSystem.add(earthOrbitMesh);
  }
  {
    const earthOrbit = new Three.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    {
      const earthMaterial = new Three.MeshPhongMaterial({
        emissive: 0x112244,
        map: loader.load("./earthsrf.jpg"),
      });
      const earthMesh = new Three.Mesh(geometry, earthMaterial);
      earthOrbit.add(earthMesh);
      objects.push(earthMesh);
    }

    const moonOrbit = new Three.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    {
      const moonMaterial = new Three.MeshPhongMaterial({
        emissive: 0x222222,
        map: loader.load("./moonsrf.jpg"),
      });
      const moonMesh = new Three.Mesh(geometry, moonMaterial);
      moonMesh.scale.set(.5, .5, .5);
      moonOrbit.add(moonMesh);
      objects.push(moonMesh);
    }
  }
}

function attachEvents() {
  window.addEventListener("keypress", (event) => {
    if(event.code === "KeyA") {
      --cameraX;
    }
    else if(event.code === "KeyD") {
      ++cameraX;
    }
    else if(event.code === "KeyW") {
      ++cameraY;
    }
    else if(event.code === "KeyS") {
      --cameraY;
    }
    else if(event.code === "KeyQ") {
      ++cameraZ;
    }
    else if(event.code === "KeyE") {
      --cameraZ;
    }
  });

  window.addEventListener("keyup", (event) => {
    if(event.code === "ArrowUp") {
      ++cameraY;
    }
    else if(event.code === "ArrowDown") {
      --cameraY;
    }
    else if(event.code === "ArrowLeft") {
      --cameraX;
    }
    else if(event.code === "ArrowRight") {
      ++cameraX;
    }
    else if(event.code === "PageUp") {
      --cameraZ;
    }
    else if(event.code === "PageDown") {
      ++cameraZ;
    }
  });
}

function applyLerp() {
  camera.position.lerp(new Three.Vector3(cameraX, cameraY, cameraZ), 0.01);
}

function rotateObjects(time) {
  objects.forEach((obj) => obj.rotation.z = time);
}

function render(time) {
  time = time /1000;
  applyLerp();
  rotateObjects(time);
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
} 

function main() {
  init();
  addObjects();
  attachEvents();
  render();
}


main();
