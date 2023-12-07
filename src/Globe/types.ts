import { ILookerStudioPayload } from './looker/types'

export type TNode = d3.Selection<d3.BaseType, unknown, HTMLElement, any>;


export interface IGlobeVisualization {
    rootElementSelector: string

    environment: any
    viewModel: any;
    vizStyles: IVizStyles;
    measure: IMeasure;
    renderStarted: boolean

    createViz: (payload: ILookerStudioPayload) => void
}

export interface IMeasure {
    canvas: ICanvas,
    globeSize: IGlobeMeasure
}

export interface IGlobeMeasure {
    globeBase: number,
    globeRadius: number,
    globeScale: number
}

export interface ICanvas {
    width: number
    height: number
    max: number
    min: number
    ratio: number
    longEdge: string
}

export interface IVizStyles {
    colorTheme: string,
    spinGlobe: boolean,
    maxDimensionColors: number,
    colorMap?: IColorMap,
}

export interface IColorMap {
    [key: string]: string;
}

export interface IViewModel {
    geo: [number, number]
    metric: number
    dimension: string
}
