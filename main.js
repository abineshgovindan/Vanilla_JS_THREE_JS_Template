import './style.css'
import * as  THREE from 'three';
const scean = new THREE.Scene();

const SphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);

const material = new THREE.MeshBasicMaterial({color:0xff0000 });

const mesh = new THREE.Mesh(SphereGeometry, material);

scean.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 3
scean.add(camera);


const canvas = document.querySelector('canvas.webgl');


const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);


renderer.render(scean, camera);

console.log(THREE)