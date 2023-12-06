import { registration } from './registration'
import { Globe } from '../viz/Globe'

import '../assets/css/base.scss';

import { ILookerStudioPayload, ILookerConnector, ILookerBaseConnector } from './types'
import { IGlobeVisualization } from '../types'

const createUpdateViz = (lookerPayload: ILookerStudioPayload, vizProperties: ILookerConnector<IGlobeVisualization>) => {
    const { chartInstance, rootElementSelector } = vizProperties;

    // Create instance of viz unless the viz does already exist
    const createNewViz = chartInstance === null || chartInstance === undefined;
    if (createNewViz) {
        console.log('Create a SuperGlobe');
        vizProperties.chartInstance = new Globe(rootElementSelector);
    }
    if (vizProperties.chartInstance) vizProperties.chartInstance.createViz(lookerPayload);
};

const baseVizProperties: ILookerBaseConnector = {
    vizName: 'SuperGlobe',
    rootElementSelector: 'body',
    debounceDelay: 100,
};

const vizProperties: ILookerConnector<IGlobeVisualization> = {
    ...baseVizProperties,
    chartInstance: null,
    callback: createUpdateViz,
};

registration.vizRegistration(vizProperties);