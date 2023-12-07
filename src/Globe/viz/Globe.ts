import * as d3 from 'd3';

import { draw } from './scripts/draw'
import { geoPoints } from './scripts/three/geoPoints'

import { ILookerStudioPayload, ILookerVizStyle, ITableData, ITableHeaderExtended } from '../looker/types';
import { IGlobeVisualization, IViewModel, IVizStyles, ICanvas, IMeasure, IColorMap } from '../types';

export class Globe implements IGlobeVisualization {
    rootElementSelector: string;

    environment: any
    viewModel: any;
    vizStyles: IVizStyles;
    measure: IMeasure;
    renderStarted: boolean

    constructor(rootElementSelector: string) {
        this.rootElementSelector = rootElementSelector;
        this.prepareMeasure(this.rootElementSelector);
        this.environment = draw.base(rootElementSelector, this.measure);
        this.renderStarted = false;
    }

    prepareMeasure(rootElementSelector: string) {
        const measure = transform.measure(rootElementSelector);
        this.measure = measure;
    }

    configuration(payload: ILookerStudioPayload) {
        this.prepareMeasure(this.rootElementSelector);
        this.vizStyles = transform.styles(payload.style);

        /* 
        TODO > expose max colors with settings
        */
        const dataset = payload.tables.DEFAULT;
        const colorMap = transform.createColorMap(dataset, payload.theme, this.vizStyles.maxDimensionColors)
        this.vizStyles.colorMap = colorMap;

        this.viewModel = transform.viewModel(dataset, this);
    }

    createViz(payload: ILookerStudioPayload) {
        this.configuration(payload);
        draw.viz(this);
    }
}

const transform = {
    styles: (style: ILookerVizStyle): IVizStyles => {
        const vizStyles = Object.keys(style).reduce((previousBlock: any, currentBlock) => {
            const value = style[currentBlock].value;
            const defaultValue = style[currentBlock].defaultValue;

            previousBlock[currentBlock] = value ? value : defaultValue;
            return previousBlock;

        }, {})

        return vizStyles;
    },

    createColorMap: (data: ITableData, theme: any, maxColors: number): IColorMap => {
        const { headers } = data
        const tableHeaders: ITableHeaderExtended[] = headers.map((d, index) => ({
            ...d, index
        }))

        const dimensionField = tableHeaders.find((d) => d.configId === 'dimensionBreakdown');
        const metricField = tableHeaders.find((d) => d.configId === 'metric');
        if (!dimensionField) return {
            other: theme.themeSeriesColor[0].color, // default color is #1 in theme
        };

        const dimensionGroup = d3.rollup(data.rows, v => d3.sum(v, d => d[metricField.index]), d => d[dimensionField.index]);

        const colorMap = Array.from(dimensionGroup)
            .sort((a, b) => b[1] - a[1])
            .slice(0, Math.min(maxColors, 20)) // there ain't no more colors + more than 5 makes little sense
            .reduce((map, item, index) => {
                const dimension = item[0];
                const color = theme.themeSeriesColor[index].color
                map[dimension] = color;
                return map
            }, {});

        colorMap['other'] = '#FFFFFF'

        return colorMap

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

    viewModel: (data: ITableData, chart: IGlobeVisualization): any => {
        // Create the initial point cloud
        // const fakeData = Helper.generateSpherePoints(180, 360, 500)
        // data.rows = fakeData
        const pointCloud = geoPoints.createPointCloud(data, chart)
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