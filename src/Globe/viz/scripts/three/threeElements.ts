/* Create globe */
import * as THREE from 'three';

import { base64Images } from '../base64Images';

export const threeElements = {
    createGlobe({ radius, texture }) {
        const geometry = new THREE.SphereGeometry(radius / 3, 360, 360, 0);
        const mask = new THREE.TextureLoader().load(base64Images.mask);

        const backMaterial = new THREE.MeshPhongMaterial({
            color: 0x242a30,
            transparent: true,
            side: THREE.BackSide,
            depthTest: true,
            depthWrite: true,
            reflectivity: 0,
            shininess: 0,
            opacity: 0,

            alphaMap: mask,
            map: mask,
        });
        const innerCube = new THREE.Mesh(geometry, backMaterial);
        innerCube.maxOpacity = 0.5;

        const frontMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
            transparent: true,
            depthTest: true,
            depthWrite: true,
            alphaMap: mask,
            map: mask,
            shininess: 0,
            reflectivity: 0,
            opacity: 0,
        });
        const outerCube = new THREE.Mesh(geometry, frontMaterial);
        outerCube.maxOpacity = 1.0;

        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
            transparent: true,
            depthTest: true,
            depthWrite: true,
            shininess: 20,
            reflectivity: 20,
            map: mask,
            opacity: 0,
        });
        const centerCube = new THREE.Mesh(geometry, centerMaterial);
        centerCube.maxOpacity = 0.6;

        const globe = new THREE.Group();
        globe.add(innerCube);
        globe.add(outerCube);
        globe.add(centerCube);

        return globe;
    },
};