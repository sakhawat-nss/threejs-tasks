import * as Three from "three";
import './style.css';

let scene;
let camera;
let renderer;
let cameraX = 0;
let cameraY = 2;
let cameraZ = 10;
let player;
let playerX = 0;
let playerY = 0;
let playerZ = 5;
let prevTime = 0;
let bullets = [];
let enemies = [];
const boxGeometry = new Three.BoxGeometry();
const playerMaterial = new Three.MeshBasicMaterial({ color: 0x00ff00 });
const enemyMaterial = new Three.MeshBasicMaterial({ color: 0xff0000 });
const bulletGeometry = new Three.CylinderGeometry(0.1, 0.1, 0.5);
const bulletMaterial = new Three.MeshBasicMaterial({ color: 0x0000ff });
const roadWidth = 25;
const enemyCount = 3400;
let downKeyA = false;
let downKeyD = false;
let downKeyW = false;
let downKeyS = false;
let downKeySpace = false;


function randomIntBetween(min, max) {
  return parseInt(min + Math.random() * (max - min + 1));
}

function init() {
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(new Three.Vector3(0, 0, -3));
  renderer = new Three.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function addPlayer() {
  const mesh = new Three.Mesh(boxGeometry, playerMaterial);
  mesh.position.set(playerX, playerY, playerZ);
  scene.add(mesh);
  player = mesh;
}

function addEnemy() {
  const mesh = new Three.Mesh(boxGeometry, enemyMaterial);
  mesh.position.set(randomIntBetween(-roadWidth, roadWidth), 0, randomIntBetween(-1000, -100));
  mesh.geometry.computeBoundingBox();
  scene.add(mesh);
  enemies.push({
    obj: mesh,
    v: new Three.Vector3(0, 0, 15),
  });
}

function addEnemies() {
  for(let i = enemies.length; i < enemyCount; i++) {
    addEnemy();
  }
}

function fire() {
  const mesh = new Three.Mesh(bulletGeometry, bulletMaterial);
  mesh.rotateX(Math.PI/2);
  mesh.position.set(player.position.x, player.position.y, player.position.z);
  scene.add(mesh);
  bullets.push({
    obj: mesh,
    v: new Three.Vector3(0, 0, -100),
  });
}

function processKeyPress() {
  if(downKeyA) {
    --playerX;
  }
  if(downKeyD) {
    ++playerX;
  }
  if(downKeyW) {
    --playerZ;
  }
  if(downKeyS) {
    ++playerZ;
  }
  if(downKeySpace) {
    fire();
  }
  if(playerZ < -10) playerZ = -10;
  if(playerZ > 10) playerZ = 10;
}

function attachEvents() {
  window.addEventListener("keypress", (event) => {
    if(event.code === "KeyA") {
      downKeyA = true;
    }
    else if(event.code === "KeyD") {
      downKeyD = true;
    }
    else if(event.code === "KeyW") {
      downKeyW = true;
    }
    else if(event.code === "KeyS") {
      downKeyS = true;
    }
    else if(event.code === "Space") {
      downKeySpace = true;
    }
  });
  window.addEventListener("keyup", (event) => {
    if(event.code === "KeyA") {
      downKeyA = false;
    }
    else if(event.code === "KeyD") {
      downKeyD = false;
    }
    else if(event.code === "KeyW") {
      downKeyW = false;
    }
    else if(event.code === "KeyS") {
      downKeyS = false;
    }
    else if(event.code === "Space") {
      downKeySpace = false;
    }
  });
  window.addEventListener("mousedown", (event) => {
    if(event.button === 0) {
      fire();
    }
  })
}

function updatePlayer(delTime) {
  player.position.lerp(new Three.Vector3(playerX, playerY, playerZ), 0.01);
  if(player.position.x < -roadWidth) {
    player.position.x = -roadWidth;
    playerX = -roadWidth;
  }
  if(player.position.x > roadWidth) {
    player.position.x = roadWidth;
    playerX = roadWidth;
  }
}

function updateBullets(delTime) {
  bullets = bullets.filter((bullet) => {
    bullet.obj.position.add(bullet.v.clone().multiplyScalar(0.01));
    if(bullet.obj.position.z < -100) {
      bullet.obj.removeFromParent();
      return false;
    }
    return true;
  });
}

function updateEnemies(delTime) {
  if(enemies.length < enemyCount) {
    addEnemies();
  }
  enemies = enemies.filter((enemy) => {
    enemy.obj.position.add(enemy.v.clone().multiplyScalar(0.01));
    if(enemy.obj.position.z > 50) {
      enemy.obj.removeFromParent();
      return false;
    }
    return true;
  });
}

function locationDetectAndDestroyEnemy(delTime) {
  bullets = bullets.filter((bullet) => {
    const crossedEnemies = enemies.filter((enemy) => {
      const bulletPosX = bullet.obj.position.x;
      const bulletPosZ = bullet.obj.position.z;
      const enemyLeft = enemy.obj.geometry.boundingBox.min.x + enemy.obj.position.x;
      const enemyRight = enemy.obj.geometry.boundingBox.max.x + enemy.obj.position.x;
      const enemyFront = enemy.obj.geometry.boundingBox.max.z + enemy.obj.position.z;
      const playerZ = player.position.z;
      const thisBulletCrossedThisEnemy = bulletPosZ < enemy.obj.position.z
                                      && enemyLeft < bulletPosX
                                      && enemyRight > bulletPosX
                                      && enemyFront < playerZ;
      return thisBulletCrossedThisEnemy;
    });
    if(crossedEnemies.length) {
      const firstHit = crossedEnemies[0];
      firstHit.obj.removeFromParent();
      enemies = enemies.filter(d => d != firstHit);
      bullet.obj.removeFromParent();
      return false;
    }
    return true;
  });
}

function updateGameStates(delTime) {
  processKeyPress();
  updatePlayer(delTime);
  updateEnemies(delTime);
  updateBullets(delTime);
  locationDetectAndDestroyEnemy(delTime);
}

function render(time) {
  updateGameStates((time - prevTime) / 1000);
  prevTime = time;
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

function main() {
  init();
  addPlayer();
  attachEvents();
  render(0);
}


main();
