export interface ILookerConnector<ChartInstanceType> extends ILookerBaseConnector {
    chartInstance: ChartInstanceType | null,
    callback: (vizPayload: any, vizProperties: ILookerConnector<ChartInstanceType>) => void
}

export interface ILookerDevConnector<ChartInstanceType> extends ILookerBaseConnector {
    chartInstance: ChartInstanceType | null,
    payloadFileName: string,
    callback: (vizProperties: ILookerConnector<ChartInstanceType>) => void
}

export interface ILookerBaseConnector {
    vizName: string,
    debounceDelay: number,
    rootElementSelector: string,
}

export interface ILookerStudioConfiguration {
    data: any[],
    style: ILookerVizStyle,
    interactions?: any[],
    features?: ILookerStudioFeatures
}

export interface ILookerVizStyle {
    [key: string]: IStyleDefinition;
}
export interface IStyleDefinition {
    defaultValue: string | boolean,
    value: string | boolean,
}

export interface ILookerStudioFeatures {
    enableComparisonDateRange?: boolean
}

export interface ILookerStudioPayload {
    tables: ITables,
    style: ILookerVizStyle,
    dateRanges: IDateRanges,
    fields: IField[],
    theme: any,
    interactions?: any,
    colorMap?: any,
}

export interface IField {
    id: string
    name: string
    type: TType
    concept: 'DIMENSION' | 'METRIC'
}

export interface ITables {
    DEFAULT: ITableData;
    COMPARISON?: ITableData;
}

export interface ITableData {
    headers: Array<ITableHeader>;
    rows: Array<ITableDataRow>;
}

export interface ITableHeader {
    id: string,
    configId: string,
    name: string,
    concept: 'DIMENSION' | 'METRIC',
    type: TType,
}

export interface ITableHeaderExtended extends ITableHeader {
    index: number
}

export type ITableDataRow = Array<any>;

export type TType = 'NULL' | 'TEXT' | 'DECIMAL' | 'DOUBLE' | 'BINARY' | 'INTEGER' | 'BOOLEAN' | 'NUMBER' | 'PERCENT'
    | 'DURATION' | 'STRING' | 'DATE' | 'DATETIME' | 'DATETIMEZONE' | 'GEO' | 'CURRENCY' | 'NONE'
    | 'COUNTRY' | 'YEAR_MONTH_DAY' | 'YEAR_QUARTER' | 'YEAR_MONTH' | 'YEAR_WEEK' | 'YEAR_MONTH_DAY_HOUR'
    | 'YEAR_MONTH_DAY_MINUTE' | 'YEAR_MONTH_DAY_SECOND' | 'MONTH' | 'QUARTER' | 'YEAR' | 'ISO_WEEK' | 'WEEK'
    | 'MONTH_DAY' | 'DAY_OF_WEEK' | 'DAY_OF_MONTH' | 'HOUR' | 'MINUTE'

export interface IDateRanges {
    DEFAULT: IDateRange;
    COMPARISON?: IDateRange;
}

export interface IDateRange {
    start: string;
    end: string;
}