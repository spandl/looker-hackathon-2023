import { ILookerStudioPayload } from './looker/types'

export type TNode = d3.Selection<d3.BaseType, unknown, HTMLElement, any>;


export interface IGlobeVisualization {
    rootElementSelector: string

    environment: any
    viewModel: any;
    vizStyles: IVizStyles;
    measure: ICanvas;

    createViz: (payload: ILookerStudioPayload) => void
}

export interface ICanvas {
    width: number
    height: number
}

export interface IVizStyles {
    theme: string,
    spinGlobe: boolean,
}

export interface IViewModel {
    geo: [number, number]
    metric: number
    dimension: string
}
