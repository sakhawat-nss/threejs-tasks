import * as Three from "three";
import './style.css';

let scene;
let camera;
let renderer;
let cameraX = 0;
let cameraY = 0;
let cameraZ = 10;
let boxes = [];
const boxInLine = 5;
const colorState = parseInt(256 / boxInLine);
// const geometry = new Three.BoxGeometry(0.5, 0.5, 0.5);


function init() {
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(cameraX, cameraY, cameraZ);
  renderer = new Three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function getColor(x, y, z) {
  x = (x + boxInLine) * colorState;
  y = (y + boxInLine) * colorState;
  z = (z + boxInLine) * colorState;
  return (x << 16) + (y << 8) + z;
}

// using BoxGeometry
// function getBox(x, y, z) {
//   const geometry = new Three.BoxGeometry(0.5, 0.5, 0.5);
//   const mesh = new Three.Mesh(geometry, new Three.MeshBasicMaterial({ color: getColor(x, y, z) }));
//   return mesh;
// }

// using BufferGeometry and vertices with indices
function getBox(x, y, z) {
  const geometry = new Three.BufferGeometry();
  const vertices = new Float32Array( [
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5, -0.5,  -0.5,
     0.5, -0.5,  -0.5,
     0.5,  0.5,  -0.5,
    -0.5,  0.5,  -0.5,
  ] );
  const indices = [
    0, 1, 2,
    2, 3, 0,
    1, 5, 6,
    6, 2, 1,
    2, 6, 7,
    7, 3, 2,
    3, 7, 4,
    4, 0, 3,
    5, 1, 0,
    0, 4, 5,
    5, 4, 7,
    7, 6, 6,
  ];
  geometry.setIndex( indices );
  geometry.setAttribute( 'position', new Three.BufferAttribute( vertices, 3 ) );
  const mesh = new Three.Mesh(geometry, new Three.MeshBasicMaterial({ color: getColor(x, y, z) }));
  return mesh;
} 

function addBoxes() {
  for(let x = -(boxInLine / 2); x < (boxInLine / 2); x++) {
    for(let y = -(boxInLine / 2); y < (boxInLine / 2); y++) {
      for(let z = -(boxInLine / 2); z < (boxInLine / 2); z++) {
        const mesh = getBox(x, y, z);
        mesh.position.set(3 * x, 3 * y, 3 * z);
        scene.add(mesh);
        boxes.push(mesh);
      }
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
