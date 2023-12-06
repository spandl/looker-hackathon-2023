import { threeElements } from './three/threeElements';
import { threeObjects } from './three/threeObjects';

export const threeEnvironment = {
    create: (rootElementSelector: string) => {
        const domElement = document.querySelector(rootElementSelector);

        /* 
        TODO > move to settings
        */
        const applicationSettings = {
            texturePath: './Globe/assets/images/',
            globeTexture: 'world.png',
            backgroundColor: '#2f383b',
            cssBackground: false,
            transitionTime: 4000,
            categoricalColorPalette: [
                '#406E9D',
                '#F68028',
                '#A96C98',
                '#B2A6A2',
                '#E3474F',
                '#65AFA9',
                '#946955',
                '#499945',
                '#EEC242',
                '#FF8F9D',
            ],
        };

        /* 
        TODO > adapt to measure
        */
        /** Environment contains scene, camera, renderer and controls */
        const environment = threeObjects.createEnvironment({
            applicationSettings,
            domElement,
            width: 800,
            height: 800,
        });

        // Create globe and add to environment
        const globe = threeElements.createGlobe({
            radius: 10,
            texture: `${applicationSettings.texturePath}${applicationSettings.globeTexture}`,
        });
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