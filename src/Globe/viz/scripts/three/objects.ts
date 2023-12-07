/*
 * Create Three objects:
 * Scene, picking scene, renderer, camera, camera control, lights
 * Combine all point clouds to one object and add to scene and picking scene */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const threeObjects = {
    createEnvironment: ({ domElement, width, height }) => {
        const scene = threeObjects.createScene();
        const camera = threeObjects.createCamera({ width, height });
        const light = threeObjects.createLight();
        const backLight = threeObjects.createBackLight();

        camera.add(light);
        camera.add(backLight);
        scene.add(camera);

        const renderer = threeObjects.createRenderer({ width, height });
        const canvas = domElement.appendChild(renderer.domElement);
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('class', 'globe');

        const controls = threeObjects.createControl({ camera, renderer });

        return { scene, camera, renderer, controls }; // pickingScene, pickingTexture
    },

    createCamera: ({ width, height }) => {
        const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        camera.position.z = 1500;
        return camera;
    },

    createControl: ({ camera, renderer }) => {
        const controls = new OrbitControls(camera, renderer.domElement);

        controls.enableDamping = true;
        controls.dampingFactor = 0.01;

        controls.screenSpacePanning = false;
        controls.enablePan = false;

        controls.zoomSpeed = 0.5;
        controls.rotateSpeed = 1;
        controls.panSpeed = 1;

        controls.minDistance = 500;
        controls.maxDistance = 3000;

        controls.minPolarAngle = Math.PI * -2; // locked to Math.Pi and 0
        controls.maxPolarAngle = Math.PI * 2;
        return controls;
    },

    createScene: () => {
        const scene = new THREE.Scene();
        return scene;
    },

    createPickingScene: ({ width, height }) => {
        const pickingScene = new THREE.Scene();
        pickingScene.background = new THREE.Color(0x000000);

        // must be identical to the size of the drawn scene
        const pickingTexture = new THREE.WebGLRenderTarget(width, height);

        return { pickingScene, pickingTexture };
    },

    createRenderer: ({ width, height }) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(1);
        renderer.setSize(width, height);
        return renderer;
    },

    createLight: () => {
        const light = new THREE.DirectionalLight(0xffffff, 0.2);
        light.position.set(5, 3, 5);
        light.intensity = 0.9;

        return light;
    },

    createBackLight: () => {
        const light = new THREE.DirectionalLight(0xffffff, 100);
        // light.position.set(0, 0, 500,);
        light.intensity = 0.9;

        return light;
    },
};
