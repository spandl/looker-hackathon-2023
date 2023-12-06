import * as dscc from '@google/dscc';
import _ from 'lodash';
import { ILookerConnector } from './types';

export const registration = {
    /** get data from local source or subscribe to Looker Studio data */
    async vizRegistration(vizProperties: ILookerConnector<any>) {
        const { debounceDelay, callback } = vizProperties;

        const dataTransform = 'tableTransform';

        const debounce = _.debounce((lookerPayload) => {
            console.log('Registration result', lookerPayload);
            callback(lookerPayload, vizProperties);
        }, debounceDelay);

        const executeProduction = () => {
            try {
                dscc.subscribeToData(debounce, {
                    transform: dscc[dataTransform],
                });
            } catch (err) {
                console.log(`An error occurred: ${err}`);
            }
        };

        executeProduction();
    },
};
