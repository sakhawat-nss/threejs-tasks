import * as Three from "three";
import { Geometry } from "three/examples/jsm/deprecated/Geometry";
import './style.css';

let scene;
let camera;
let renderer;
let cameraX = 0;
let cameraY = 50;
let cameraZ = 250;
let boxes = [];

function init() {
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(cameraX, cameraY, cameraZ);
  renderer = new Three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

// using default BufferGeometry
function addBoxes() {
  const geometry = new Three.BoxGeometry(0.5, 0.5, 0.5);
  const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });

  const boxInLine = 50/2;
  const colorState = (256 * 2) / boxInLine;
  function getColor(x, y, z) {
    x = x + boxInLine * 2;
    y = y + boxInLine * 2;
    z = z + boxInLine * 2;
    return (x << 16) + (y << 8) + z;
  }
  for(let x = -boxInLine; x < boxInLine; x++) {
    for(let y = -boxInLine; y < boxInLine; y++) {
      for(let z = -boxInLine; z < boxInLine; z++) {
        const mesh = new Three.Mesh(geometry, new Three.MeshBasicMaterial({ color: getColor(x, y, z) }));//material);
        mesh.position.set(3 * x, 3 * y, 3 * z);
        scene.add(mesh);
        boxes.push(mesh);
      }
    }
  }
}

// using Geometry
// function addBoxes() {
//   const material = new Three.MeshNormalMaterial()
//   let geometry = new Geometry()
//   geometry.vertices.push(
//       new Three.Vector3(1, 1, 1),
//       new Three.Vector3(-1, -1, 1), 
//       new Three.Vector3(-1, 1, -1), 
//       new Three.Vector3(1, -1, -1)
//   )
//   geometry.faces.push(
//       new Three.Face3(2, 1, 0),
//       new Three.Face3(0, 3, 2),
//       new Three.Face3(1, 3, 0),
//       new Three.Face3(2, 3, 1)
//   )
//   geometry.computeFlatVertexNormals()
//   const mesh = new Three.Mesh(geometry, material)
//   scene.add(mesh)
// }

function attachEvents() {
  window.addEventListener("keypress", (event) => {
    if(event.code === "KeyA") {
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
  camera.position.lerp(new Three.Vector3(cameraX, cameraY, cameraZ), 0.01);
}

function rotateBoxes(time) {
  boxes.forEach((box) => {
    box.rotation.x = time
    box.rotation.y = time
    box.rotation.z = time
  });
}

function render(time) {
  time = time / 1000;
  applyLerp();
  rotateBoxes(time);
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
} 

function main() {
  init();
  addBoxes();
  attachEvents();
  render();
}


main();
