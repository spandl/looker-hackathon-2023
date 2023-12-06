import { sphere } from './three/sphere';
import { threeObjects } from './three/objects';

import { IMeasure } from '../../types'

export const threeEnvironment = {
    create: (rootElementSelector: string, measure: IMeasure) => {
        const { canvas, globeSize } = measure;
        const { globeScale } = globeSize;
        const { width, height } = canvas;
        const domElement = document.querySelector(rootElementSelector);

        /** Environment contains scene, camera, renderer and controls */
        const environment = threeObjects.createEnvironment({
            domElement,
            width,
            height,
        });

        // Create globe and add to environment
        const globe = sphere.createGlobe(globeSize.globeBase);
        globe.name = 'globe';
        const { scene } = environment;
        scene.add(globe);

        return environment;
    },
}