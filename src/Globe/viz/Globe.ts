import { draw } from './scripts/draw'
import { geoPoints } from './scripts/three/geoPoints'

import { ILookerStudioPayload, ILookerVizStyle, ITableData } from '../looker/types';
import { IGlobeVisualization, IViewModel, IVizStyles, ICanvas } from '../types';

export class Globe implements IGlobeVisualization {
    rootElementSelector: string;

    environment: any
    viewModel: any;
    vizStyles: IVizStyles;
    measure: ICanvas;

    constructor(rootElementSelector: string) {
        this.rootElementSelector = rootElementSelector;
        const measure = transform.measure(rootElementSelector);
        this.environment = draw.base(rootElementSelector, measure);
        this.measure = measure;
    }

    configuration(payload: ILookerStudioPayload) {
        this.vizStyles = transform.styles(payload.style);
        this.viewModel = transform.viewModel(payload.tables.DEFAULT);
    }

    createViz(payload: ILookerStudioPayload) {
        this.configuration(payload);
        draw.viz(this);
    }
}

const transform = {
    styles: (style: ILookerVizStyle): IVizStyles => {
        const visStyles = Object.keys(style).reduce((previousBlock: any, currentBlock) => {
            const value = style[currentBlock].value;
            const defaultValue = style[currentBlock].defaultValue;

            previousBlock[currentBlock] = value ? value : defaultValue;
            return previousBlock;

        }, {})

        return visStyles;
    },

    measure: (rootElementSelector: string): ICanvas => {
        const container = document.querySelector(rootElementSelector) as HTMLElement;
        if (!container) throw new Error(`Element with selector '${rootElementSelector}' not found.`);

        const width = container.offsetWidth;
        const height = container.offsetHeight;
        return {
            width,
            height
        }
    },

    viewModel: (data: ITableData): any => {
        // Create the initial point cloud
        const pointCloud = geoPoints.createPointCloud(data)
        return pointCloud;
    },
}