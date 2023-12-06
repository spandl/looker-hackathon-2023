import _ from 'lodash';
import { ILookerDevConnector } from '../../Globe/looker/types';

export const registration = {
    /** get data from local source or subscribe to Looker Studio data */
    async vizRegistration(vizProperties: ILookerDevConnector<any>) {
        const { debounceDelay, callback, rootElementSelector } = vizProperties;

        const debounce = _.debounce((vizProperties) => {
            console.log('Development registration result', vizProperties);
            callback(vizProperties);
        }, debounceDelay);

        const executeLocal = () => {
            // react on a resize of the div
            const container = document.querySelector(rootElementSelector);
            if (!container) return;
            const containerId = container.id;

            const resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.target.id === containerId) {
                        debounce(vizProperties);
                    }
                });
            });

            if (container !== null) {
                resizeObserver.observe(container);
            }
        };

        executeLocal();
    },
};
