import * as Three from "three";
import './style.css';

let scene;
let camera;
let renderer;
let cameraX = 0;
let cameraZ = 2;

function init() {
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = cameraZ;
  renderer = new Three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function addSphere() {
  const geometry = new Three.SphereGeometry();
  const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new Three.Mesh(geometry, material);
  scene.add(mesh);
}

function attachEvents() {
  window.addEventListener("keypress", (event) => {
    if(event.code === "KeyA") {
      //camera.position.x -= 0.1;
      --cameraX;
    }
    else if(event.code === "KeyD") {
      ++cameraX;
    }
    else if(event.code === "KeyW") {
      --cameraZ;
    }
    else if(event.code === "KeyS") {
      ++cameraZ;
    }
  });
}

function applyLerp() {
  camera.position.lerp(new Three.Vector3(cameraX, 0, cameraZ), 0.01);
}

function render() {
  applyLerp();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
} 

function main() {
  init();
  addSphere();
  attachEvents();
  render();
}


main();
