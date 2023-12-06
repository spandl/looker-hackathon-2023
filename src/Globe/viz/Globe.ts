import { draw } from './scripts/draw'
import { geoPoints } from './scripts/three/geoPoints'

import { ILookerStudioPayload, ILookerVizStyle, ITableData } from '../looker/types';
import { IGlobeVisualization, IViewModel, IVizStyles, ICanvas, IMeasure } from '../types';

export class Globe implements IGlobeVisualization {
    rootElementSelector: string;

    environment: any
    viewModel: any;
    vizStyles: IVizStyles;
    measure: IMeasure;

    constructor(rootElementSelector: string) {
        this.rootElementSelector = rootElementSelector;
        this.prepareMeasure(this.rootElementSelector);
        this.environment = draw.base(rootElementSelector, this.measure);
    }

    prepareMeasure(rootElementSelector: string) {
        const measure = transform.measure(rootElementSelector);
        this.measure = measure;
    }

    configuration(payload: ILookerStudioPayload) {
        this.prepareMeasure(this.rootElementSelector);
        this.vizStyles = transform.styles(payload.style);
        this.viewModel = transform.viewModel(payload.tables.DEFAULT, this.measure);
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

    measure: (rootElementSelector: string): IMeasure => {
        const container = document.querySelector(rootElementSelector) as HTMLElement;
        if (!container) throw new Error(`Element with selector '${rootElementSelector}' not found.`);

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        const max = width > height ? width : height;
        const min = width > height ? height : width;

        const canvas: ICanvas = {
            width,
            height,
            max,
            min,
            longEdge: width > height ? 'width' : 'height',
            ratio: width / height,
        };

        const globeBase = 100;
        const globeRadius = min / 2;
        const globeScale = globeRadius / globeBase;

        const globe = { globeBase, globeRadius, globeScale }

        return {
            canvas,
            globeSize: globe
        }
    },

    viewModel: (data: ITableData, measure: IMeasure): any => {
        // Create the initial point cloud

        const fakeData = Helper.generateSpherePoints(180, 360, 500)
        // data.rows = fakeData
        const pointCloud = geoPoints.createPointCloud(data, measure)
        return pointCloud;
    },
}

const Helper = {
    generateSpherePoints: (latitudeBands: number, longitudeBands: number, radius: number) => {


        const lonStart = -180;
        const lonEnd = 180;
        const latStart = -90;
        const latEnd = 90;
        const step = 8;

        const longitudeArray = Array.from({ length: (lonEnd - lonStart) / step + 1 }, (_, index) => lonStart + index * step);
        const latitudeArray = Array.from({ length: (latEnd - latStart) / step + 1 }, (_, index) => latStart + index * step);

        const points = longitudeArray.flatMap(longitude =>
            latitudeArray.map(latitude => [`${longitude}, ${latitude}`, 1000])
        );

        return points;
    }

}