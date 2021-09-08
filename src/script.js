import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import crossResource from './assets/images/cross.png';

// Texture loader
const loader = new THREE.TextureLoader();
const cross = loader.load(crossResource);

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 )
const particlesGeo = new THREE.BufferGeometry()
const particlesCount = 7000

const posArray = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount * 3; i++) {
    // posArray[i] = Math.random() - 0.5;
    posArray[i] = (Math.random() - 0.5) * 5
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials
const material = new THREE.PointsMaterial({
    size: 0.005,
    transparent: true,
})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    map: cross,
    transparent: true
})

// Mesh
const sphere = new THREE.Points(geometry,material);
const particlesMesh = new THREE.Points(particlesGeo, particlesMaterial);
sphere.position.x = -1.5;
scene.add(sphere, particlesMesh);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#21282A'), 1);


// Event listener
document.addEventListener('mousemove', animateParticles);
document.body.onscroll = moveCamera;

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
    // mouseY = event.clientY - (window.innerHeight / 2);
    // mouseX = event.clientX - (window.innerWidth / 2);

    mouseY = event.clientY;
    mouseX = event.clientX;

    // console.log(`mouseY ${mouseY}`);
    // console.log(`mouseX ${mouseX}`);
  }

function moveCamera() {
    const distance = document.body.getBoundingClientRect().top;

    sphere.position.z = distance * 0.005;
    sphere.position.x = -1.5 +  distance * -0.001;
    sphere.position.y = distance * -0.007;

}




/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = .2 * elapsedTime;
    particlesMesh.rotation.y = -0.02 * elapsedTime;
    particlesMesh.rotation.x = -0.02 * elapsedTime;

    if (mouseX > 0) {
        particlesMesh.rotation.x += -mouseY * (10 * 0.00001);
        particlesMesh.rotation.y += mouseX * (10  * 0.00001);
    }


    // if (mouseX > 0) {
    //   particlesMesh.rotation.y += mouseX * (10  * 0.000001);
    //   // particlesMesh.rotation.x = 0.02 * elapsedTime;
    // } else {
    //   // particlesMesh.rotation.x = -0.02 * elapsedTime;
    // }

    // if (mouseY > 0) {
      
    //   particlesMesh.rotation.x += -mouseY * (10 * 0.000001);
    //   // particlesMesh.rotation.y = 0.02 * elapsedTime;
    // } else {
    //   // particlesMesh.rotation.x = -0.02 * elapsedTime;
    // }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// HTML Typewriter animation
const newRow = document.createElement('br');
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Axel Briano\nSuherik", "Axel", "axelbrians"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    if(textArray[textArrayIndex].charAt(charIndex) === '\\') {
        typedTextSpan.textContent += "\n";
        charIndex++;
    } else {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    }
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    if (textArray[textArrayIndex].charAt(charIndex - 1) === "n") {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-2);
        charIndex--;
    } else {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    }
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});