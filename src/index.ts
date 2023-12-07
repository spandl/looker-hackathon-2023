import * as d3 from 'd3';

import './Globe/assets/css/base.scss';
import { registration } from './DEV/scripts/registration'
import { Globe } from './Globe/viz/Globe'

import { ILookerStudioPayload, ILookerDevConnector, ILookerBaseConnector } from './Globe/looker/types'
import { IGlobeVisualization } from './Globe/types'

const payloadFileName = 'dimensions'; // payload


const createUpdateViz = async (vizProperties: ILookerDevConnector<IGlobeVisualization>) => {
    const { chartInstance, rootElementSelector } = vizProperties;

    // Load data here
    const lookerPayload: ILookerStudioPayload = await d3.json(`./DEV/testFiles/${payloadFileName}.json`);;

    // Create instance of viz unless the viz does already exist
    const createNewViz = chartInstance === null || chartInstance === undefined;
    if (createNewViz) {
        console.log('Testing the SuperGlobe');
        vizProperties.chartInstance = new Globe(rootElementSelector);
    }
    if (vizProperties.chartInstance) vizProperties.chartInstance.createViz(lookerPayload);
};

const baseVizProperties: ILookerBaseConnector = {
    vizName: 'SuperGlobe',
    rootElementSelector: '.test .container',
    debounceDelay: 100,
};

const vizProperties: ILookerDevConnector<IGlobeVisualization> = {
    ...baseVizProperties,
    payloadFileName,
    chartInstance: null,
    callback: createUpdateViz,
};

registration.vizRegistration(vizProperties);