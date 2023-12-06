import * as THREE from 'three';

import { threeEnvironment } from "./environment";
import { IGlobeVisualization, IMeasure } from '../../types'

export const draw = {
    base(rootElementSelector: string, measure: IMeasure): any {
        const { globeSize } = measure;
        const { globeScale } = globeSize;

        const environment = threeEnvironment.create(rootElementSelector, measure);

        // find globe in scene
        const { scene } = environment;
        const globe = scene.children.find(d => d.name === 'globe')
        if (!globe) return environment;

        const globes = globe.children.filter((d) => d.type === 'Mesh');

        globes.forEach((globe) => {
            globe.material.opacity = globe.maxOpacity * 1;

            globe.scale.x = globeScale;
            globe.scale.y = globeScale;
            globe.scale.z = globeScale;
        });

        return environment;
    },

    render: (environment: any, measure: IMeasure) => {
        const { scene, renderer, camera, controls } = environment;
        const pointCloud = scene.children.find(d => d.isPoints)

        /* Render Loop*/
        const animate = () => {
            // Animation.pointCloud(pointCloud);
            Animation.animateGlobe(scene, measure, 1);
            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            /* Camera Controls */
            controls.update();
        }

        animate();
    },

    viz(chart: IGlobeVisualization) {
        const { environment, viewModel, measure } = chart;
        const { scene } = environment;

        // remove existing point cloud before adding new
        /* 
        TODO > replace with fade in/out
        */
        const pointCloud = scene.children.find(d => d.isPoints);
        if (pointCloud) {
            pointCloud.geometry.dispose();
            pointCloud.material.dispose();
            scene.remove(pointCloud);
        }

        scene.add(viewModel);

        // Update environment
        Animation.environmentUpdate(chart)

        draw.render(environment, measure);
    },
}

const Animation = {
    animateGlobe(scene: any, measure: IMeasure, progress: number) {
        const { globeSize } = measure;
        const { globeScale } = globeSize;

        const globeObject = scene.children.find(d => d.name === 'globe')
        const globes = globeObject.children.filter((d) => d.type === 'Mesh');

        globes.forEach((globe) => {
            globe.material.opacity = globe.maxOpacity * progress;

            globe.scale.x = globeScale;
            globe.scale.y = globeScale;
            globe.scale.z = globeScale;
        });

        // const rotationStep = this.views.insight.rotate === true ? (this.views.insight.rotationSpeed / 1000) : 0;
        // this.globe.rotation.y -= rotationStep;

    },

    environmentUpdate: (chart: IGlobeVisualization) => {
        const { environment, measure } = chart;
        const { camera, renderer } = environment;
        const { canvas } = measure;

        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height);
    },

    pointCloud: (pointCloud: any) => {

        const positions = pointCloud.geometry.attributes.position.array;
        const colors = pointCloud.geometry.attributes.color.array;
        const sizes = pointCloud.geometry.attributes.size.array;

        sizes.forEach((element: any, index: number) => {
            // COLORS
            const colorCode = '#FF0000'; // rework for dimension breakdown
            const color = new THREE.Color(colorCode);

            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;

            // SIZE
            const newSize = Math.random() * 2;
            sizes[index] = newSize

        });

        pointCloud.geometry.attributes.color.needsUpdate = true;
        pointCloud.geometry.attributes.size.needsUpdate = true;

    }
}