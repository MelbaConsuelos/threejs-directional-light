import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, mesh, cameraControls, gui, stats, directionalLight;
window.anim = false;

function init(event) {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
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
    let lightColor = "#f9f9f9";
    let lightIntensity = 2;
    directionalLight = new THREE.DirectionalLight( lightColor, lightIntensity );
    directionalLight.position.set(2, 5, 6);
    directionalLight.target.position.set(0, 3, 0);
    console.log(directionalLight);

            
    // MODEL
    // BOX
    const cubeSize = 3;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
    mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(0, 0.5, 0);
    

    // FLOOR
    let floor = new Floor();

    // SCENE HIERARCHY
    scene.add(mesh);
    scene.add(floor);
    scene.add(directionalLight);
    scene.add(directionalLight.target);


    // GUI
    gui = new dat.GUI();
    // SHOW/HIDE FLOOR
    gui.add(floor, "visible").name("Floor").setValue(false).listen().onChange(function(value) {

    });
    gui.add(window, "anim").name("Animation").listen().onChange(function(value) {

    });

    gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color');
    gui.add(directionalLight, 'intensity', 0, 2, 0.01);
    gui.add(directionalLight.target.position, 'x', -10, 10);
    gui.add(directionalLight.target.position, 'z', -10, 10);
    gui.add(directionalLight.target.position, 'y', 0, 10);
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
    if(anim) {
        mesh.rotation.x = mesh.rotation.x + 0.01;
        mesh.rotation.y = mesh.rotation.y + 0.01;
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

class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }


