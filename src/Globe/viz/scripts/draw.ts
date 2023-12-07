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
        return environment;

    },

    render: (chart: IGlobeVisualization) => {
        const { environment, viewModel, measure, vizStyles } = chart;
        const { scene, renderer, camera, controls } = environment;
        const pointCloud = scene.children.find(d => d.isPoints)

        /* Render Loop*/
        const animate = () => {
            // Animation.pointCloud(pointCloud);
            Animation.animateGlobe(scene, vizStyles.spinGlobe);
            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            /* Camera Controls */
            controls.update();

            // console.log(camera.position)
        }

        if (!chart.renderStarted) {
            animate();
            chart.renderStarted = true;
        }

    },

    viz(chart: IGlobeVisualization) {
        const { environment, viewModel } = chart;
        const { scene } = environment;

        Animation.applyTheme(chart);
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

        draw.render(chart);

    },
}

const Animation = {
    applyTheme: (chart: IGlobeVisualization) => {
        const { environment, vizStyles } = chart;
        const { scene } = environment;

        const darkTheme = {
            innerColor: '#242a30',
            outerColor: '#355561',
            centerColor: '#606a6e',
            innerOpacity: 0.2,
            centerOpacity: 0.6,
            outerOpacity: 1,
            background: '#222b2e'
        };

        const lightTheme = {
            innerColor: '#f5e6b5',
            outerColor: '#83e7eb',
            centerColor: '#F4F4F4',
            innerOpacity: 0.1,
            centerOpacity: 0.3,
            outerOpacity: 0.9,
            background: '#F4F4F4'
        };

        const theme = vizStyles.colorTheme === 'dark'
            ? darkTheme
            : lightTheme

        // Scene background
        scene.background = new THREE.Color(theme.background);

        // globe colors
        const globeObject = scene.children.find(d => d.name === 'globe')
        const globes = globeObject.children.filter((d) => d.type === 'Mesh');

        const centerCube = globes.find(d => d.name === 'centerCube');
        centerCube.material.color.set(theme.centerColor);
        centerCube.material.opacity = theme.centerOpacity;

        const innerCube = globes.find(d => d.name === 'innerCube');
        innerCube.material.color.set(theme.innerColor);
        innerCube.material.opacity = theme.innerOpacity;

        const outerCube = globes.find(d => d.name === 'outerCube');
        outerCube.material.color.set(theme.outerColor);
        outerCube.material.opacity = theme.outerOpacity;
    },

    animateGlobe(scene: any, rotate: boolean) {
        const globeObject = scene.children.find(d => d.name === 'globe')
        const pointCloud = scene.children.find((d) => d.type === 'Points');

        const rotationSpeed = 0.0015;
        const rotationStep = rotate ? rotationSpeed : 0;
        globeObject.rotation.y -= rotationStep;
        pointCloud.rotation.y = globeObject.rotation.y;

    },

    environmentUpdate: (chart: IGlobeVisualization) => {
        const { environment, measure } = chart;
        const { camera, renderer, scene } = environment;
        const { canvas, globeSize } = measure;
        const { globeScale } = globeSize;

        const globeObject = scene.children.find(d => d.name === 'globe')
        const globes = globeObject.children.filter((d) => d.type === 'Mesh');

        globes.forEach((globe) => {
            globe.scale.x = globeScale;
            globe.scale.y = globeScale;
            globe.scale.z = globeScale;
        });

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