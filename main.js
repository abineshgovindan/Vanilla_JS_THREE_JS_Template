import './style.css'
import * as  THREE from 'three';
import * as dat from 'dat.gui'

import nebula from './public/nebula.jpg'
import stars from './public/stars.jpg'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
//glft 
const wifiUrl = new URL('./public/wifi.gltf', import.meta.url);


//Creating scene
const scene = new THREE.Scene();
//texture loader
const  textureLoader = new  THREE.TextureLoader();

//object
const SphereGeometry = new THREE.TorusKnotGeometry( 30, 0.2, 64, 8); 
const material = new THREE.MeshBasicMaterial({
  //color:0xff0000,
map: textureLoader.load(nebula) });
const mesh = new THREE.Mesh(SphereGeometry, material);


scene.add(mesh);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerWidth
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(-10, 30, 30);

// console.log(mesh.position.distanceTo(camera.position))
// console.log(mesh.position.normalize())



const canvas = document.querySelector('canvas.webgl');
const orbit = new OrbitControls(camera,canvas);
scene.add(camera);

orbit.update();
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);




const planeGeometry = new THREE.PlaneGeometry(30, 30);
const PlaneMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF,
side: THREE.DoubleSide});
const planeMesh = new THREE.Mesh(planeGeometry, PlaneMaterial);

scene.add(planeMesh);

planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.receiveShadow  = true;
//console.log("Math PI -> " + Math.PI);

const SGeometry = new THREE.SphereGeometry(2, 30,30);
const Smaterial = new THREE.MeshStandardMaterial({color: 0xF10F, 
wireframe: false});

const Smesh = new THREE.Mesh(SGeometry, Smaterial);
scene.add(Smesh);


Smesh.position.set(-10, 10 ,0)
Smesh.castShadow = true;

const color = new THREE.Color('white');
// intensity = 100,
// distance = 30,
// angle = Math.PI * .3,
//  = 0.25,
// decay = 0.5;
const spotLight = new THREE.SpotLight(color);
spotLight.position.set(-100,100, 0);
spotLight.castShadow = true;
scene.add(spotLight);




const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);
// const ambient = new THREE.AmbientLight(0x333333);
// scene.add(ambient);

// const directinalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
// scene.add(directinalLight)

// directinalLight.position.set(-30, 50, 0);

// directinalLight.castShadow = true;

// directinalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directinalLight)
// scene.add(dLightHelper);
// const dlightShadow = new THREE.CameraHelper(directinalLight.shadow.camera)
// scene.add(dlightShadow)

//scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);
//renderer.setClearColor(0xFFE00);

// scene.background = textureLoader.load(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars
])
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
  new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),

]
const boxGeometry2 = new THREE.BoxGeometry(4,4,4);
const boxMaterial = new THREE.MeshBasicMaterial({
  //color: 0x00FF00,
  map: textureLoader.load(nebula),

})

const box2 = new THREE.Mesh(boxGeometry2, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10)


//GLTF Loader

const assertLoader = new GLTFLoader();

assertLoader.load(wifiUrl.href, function(gltf){
  const model = gltf.scene;
  scene.add(model);
  model.position.set(-12, 4, 10);
  model.rotation.x= 50;
}, undefined, function(error){
  console.log(error);
})


const gui = new dat.GUI();
 
const option = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed : 0.02,
  penumbra: 0,
  angle : 3,
  intensity: 4.6,
  distance: 800,
  decay : 0,

};
gui.addColor(option, 'sphereColor').onChange(function(e){
  Smesh.material.color.set(e);
});

gui.add(option, 'wireframe').onChange(function(e){
   Smesh.material.wireframe = e;
});

gui.add(option, 'speed', 0, 0.1);

gui.add(option, 'penumbra', 0, 10);
gui.add(option, 'angle', 0, 10);
gui.add(option, 'intensity', 0, 10);
gui.add(option, 'distance', 0, 1000);
gui.add(option, 'decay', 0, 10);

let step =0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 -1;
   mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

//----------------------------------------------------------------
const SmeshId = Smesh.id;
box2.name = 'theBox';
const boxid =  box2.id;
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
function animate(time) {
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  mesh.rotation.x = time /1000;
  mesh.rotation.y = time / 1000;
  step+= option.speed;
  Smesh.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle =   option.angle;
  spotLight.intensity = option.intensity;
  spotLight.distance = option.distance;
  spotLight.penumbra = option.penumbra;
  spotLight.decay = option.decay;
  sLightHelper.update();
 raycaster.setFromCamera(mousePosition, camera);
  
  const intersects = raycaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++){

      if(intersects[i].object.id === SmeshId){
       // alert(intersects[i].object.id +" = " + box2.id);
        intersects[i].object.material.color.set(0xFF0000);
      }
      if(intersects[i].object.name === 'theBox'){
         intersects[i].object.rotation.x = time /1000;
          intersects[i].object.rotation.y = time / 1000;
      }
    }
  
  

 
 
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);


window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})