import { threeEnvironment } from "./environment";
import { IGlobeVisualization, ICanvas } from '../../types'

export const draw = {
    base(rootElementSelector: string, measure: ICanvas): any {
        const environment = threeEnvironment.create(rootElementSelector, measure);

        // find globe in scene
        const { scene } = environment;
        const globe = scene.children.find(d => d.name === 'globe')
        if (!globe) return environment;

        const globes = globe.children.filter((d) => d.type === 'Mesh');

        globes.forEach((globe) => {
            globe.material.opacity = globe.maxOpacity * 1;

            globe.scale.x = 100;
            globe.scale.y = 100;
            globe.scale.z = 100;
        });

        return environment;
    },

    render: (environment) => {
        const { scene, renderer, camera, controls } = environment;

        /* Render Loop*/
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            /* Camera Controls */
            controls.update();
        }

        animate();
    },

    viz(chart: IGlobeVisualization) {
        const { environment, viewModel } = chart;
        const { scene } = environment;

        scene.add(viewModel);
        draw.render(chart.environment);
    },
}