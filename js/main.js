/*
* Melba Consuelos A01410921
* Paola Villarreal A00821971
* Natalia González A01382007
*/
import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import { OrbitControls } from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, box, cameraControls, gui, stats, directionalLight;
window.anim = false;

function init(event) {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fovy = 60.0;    // Field ov view
    let aspectRatio = window.innerWidth / window.innerHeight;
    let nearPlane = 0.1;
    let farPlane = 10000.0;
    camera = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera.position.set(2, 2, 5);
    cameraControls = new OrbitControls(camera, renderer.domElement);

    // LIGHT
    let pointLightColor = "white";
    let lightIntensity = 2;
    directionalLight = new THREE.DirectionalLight(pointLightColor, lightIntensity);
    directionalLight.position.set(2, 5, 6);
    directionalLight.target.position.set(0, 3, 0);
    let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

    // MODEL - BOX
    let geometry = new THREE.BoxGeometry(1);
    let material = new THREE.MeshPhongMaterial({ color: '#8AC' });
    box = new THREE.Mesh(geometry, material);
    box.position.set(0, 0.5, 0);

    // FLOOR
    let floor = new Floor();

    // SCENE HIERARCHY
    scene.add(box);
    scene.add(floor);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    scene.add(directionalLightHelper);

    // GUI
    gui = new dat.GUI();

    // SHOW/HIDE FLOOR
    gui.add(floor, "visible").name("Floor").setValue(false).listen().onChange(function (value) {

    });

    // START/STOP ANIMATION
    gui.add(window, "anim").name("Animation").listen().onChange(function (value) {

    });

    // SLIDERS
    gui.add(directionalLight, "intensity").min(0).max(2).step(0.01).setValue(2).name("Intensity").listen().onChange(function (value) {

    });
    gui.add(directionalLight.target.position, "x").min(-10).max(10).step(1).setValue(0).name("Target X").listen().onChange(function (value) {
        directionalLightHelper.update();
    });
    gui.add(directionalLight.target.position, "y").min(-10).max(10).step(1).setValue(0).name("Target Y").listen().onChange(function (value) {
        directionalLightHelper.update();
    });
    gui.add(directionalLight.target.position, "z").min(-10).max(10).step(1).setValue(0).name("Target Z").listen().onChange(function (value) {
        directionalLightHelper.update();
    });

    // COLORS
    let params = {
        boxColor: new THREE.Color(1, 1, 1),
        directionalLightColor: new THREE.Color(1, 1, 1)
    }
    gui.addColor(params, "boxColor").name("Box Color").listen().onChange(function (color) {
        box.material.color = new THREE.Color(color.r / 255, color.g / 255, color.b / 255);
    });
    gui.addColor(params, "directionalLightColor").name("Light Color").listen().onChange(function (color) {
        directionalLight.color = new THREE.Color(color.r / 255, color.g / 255, color.b / 255);
    });

    gui.open();

    // SETUP STATS
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // DRAW SCENE IN A RENDER LOOP (ANIMATION)
    renderLoop();
}

function renderLoop() {
    stats.begin();
    renderer.render(scene, camera); // DRAW SCENE
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {
    if (anim) {
        box.rotation.x = box.rotation.x + 0.01;
        box.rotation.y = box.rotation.y + 0.01;
    }
}

// EVENT LISTENERS & HANDLERS

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// MODELS
class Floor extends THREE.Mesh {
    constructor() {
        super();
        this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        this.material = new THREE.MeshBasicMaterial();
        this.rotation.x = -0.5 * Math.PI;
        this.wireframeHelper = new THREE.LineSegments(new THREE.WireframeGeometry(this.geometry));
        this.wireframeHelper.material.color = new THREE.Color(0.2, 0.2, 0.2);
        this.add(this.wireframeHelper);
        this.visible = false;
    }
}



