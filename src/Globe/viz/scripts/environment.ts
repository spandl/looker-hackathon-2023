import { threeElements } from './three/threeElements';
import { threeObjects } from './three/threeObjects';

import { ICanvas } from '../../types'

export const threeEnvironment = {
    create: (rootElementSelector: string, measure: ICanvas) => {

        const { width, height } = measure
        const domElement = document.querySelector(rootElementSelector);
        /* 
        TODO > adapt to measure
        */
        /** Environment contains scene, camera, renderer and controls */
        const environment = threeObjects.createEnvironment({
            domElement,
            width,
            height,
        });

        // Create globe and add to environment
        const globe = threeElements.createGlobe(10);
        globe.name = 'globe';
        const { scene } = environment;
        scene.add(globe);

        return environment;
    },

    animateGlobe({ progress }) {
        const globes = this.globe.children.filter((d) => d.type === 'Mesh');

        globes.forEach((globe) => {
            globe.material.opacity = globe.maxOpacity * progress;

            globe.scale.x = this.globeScale;
            globe.scale.y = this.globeScale;
            globe.scale.z = this.globeScale;
        });

        const rotationStep = this.views.insight.rotate === true ? (this.views.insight.rotationSpeed / 1000) : 0;
        this.globe.rotation.y -= rotationStep;

    },
}