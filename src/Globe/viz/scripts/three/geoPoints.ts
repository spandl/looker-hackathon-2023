import * as THREE from 'three';
import * as d3 from 'd3';

import point_vertex from './shaders/point_vertex.gsgl';
import point_fragment from './shaders/point_fragment.gsgl';

import { Tools } from '../tools';
import { base64Images } from '../base64Images';

import { ITableData, ITableHeaderExtended, ITableDataRow } from '../../../looker/types'
import { IMeasure, IGlobeVisualization, IColorMap } from '../../../types';

export const geoPoints = {

    createPointCloud: (data: ITableData, chart: IGlobeVisualization) => {
        const { measure, vizStyles } = chart;
        const { headers, rows } = data;
        const { colorMap } = vizStyles

        const tableHeaders: ITableHeaderExtended[] = headers.map((d, index) => ({
            ...d, index
        }))

        // maxSize depends on number of items to be rendered
        const calculatePointSize = (itemCount: number) => {
            const maxSize = 40;
            const minSize = 14;
            itemCount = Math.max(1, itemCount);

            const scale = d3.scaleLog()
                .domain([200, 50000])
                .range([maxSize, minSize])
                .clamp(true);

            return Math.floor(scale(itemCount))
        }

        const pointSize = calculatePointSize(rows.length)

        const geometry = geoPoints.createPointGeometry(rows, tableHeaders, colorMap, measure, pointSize);
        const material = geoPoints.createShaderMaterial(pointSize);

        const pointCloud = new THREE.Points(geometry, material);
        pointCloud.frustumCulled = false;

        return pointCloud;
    },

    createPointGeometry: (rows: Array<ITableDataRow>, tableHeaders: ITableHeaderExtended[],
        colorMap: IColorMap, measure: IMeasure, fixedSize: number) => {
        const { globeSize } = measure;
        const { globeRadius, globeScale } = globeSize;
        const metricField = tableHeaders.find((d) => d.configId === 'metric');
        const metricIndex = metricField.index

        const geoField = tableHeaders.find((d) => d.configId === 'geoLocation');
        const geoIndex = geoField.index

        const dimensionField = tableHeaders.find((d) => d.configId === 'dimensionBreakdown');

        const scaleDomain = d3.extent(rows, d => d[metricIndex])
        const domain = Tools.normalizeExtent(scaleDomain)

        const metricScale = d3
            .scaleLinear()
            .domain(domain)
            .range([0, 200])

        const objCount = rows.length;
        const geometry = new THREE.BufferGeometry();

        // Position
        const positions = new Float32Array(objCount * 3).fill(1.0);

        // Color
        const colors = new Float32Array(objCount * 3).fill(1.0);

        // Size
        const sizes = new Float32Array(objCount).fill(1.0);

        const getColor = (element: any[]): string => {
            if (dimensionField) {
                const { index } = dimensionField;
                return colorMap[element[index]];
            }

            return colorMap.other;
        }

        rows.forEach((element, index) => {
            // COLORS
            const colorCode = getColor(element)
            const color = new THREE.Color(colorCode);

            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;

            // SIZE
            const size = fixedSize; // metricScale(element[metricIndex]);
            sizes[index] = size;

            // GEO LOCATION
            const geoLocation = element[geoIndex].split(',')
            const { x, y, z } = Tools.getCoordinatesFromLatLng(Number(geoLocation[0]), Number(geoLocation[1]), globeRadius + fixedSize / 4 / globeScale);

            const t = 1
            positions[index * 3] = x * t;
            positions[index * 3 + 1] = y * t;
            positions[index * 3 + 2] = z * t;

        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        // geometry.drawRange = {
        //     start: 0,
        //     count: 1,
        // };

        return geometry;
    },

    createShaderMaterial: (fixedSize: number) => {

        const vertexShader = point_vertex;
        const fragmentShader = point_fragment;
        const pointTexture = new THREE.TextureLoader().load(base64Images.circle50); // pointTexture

        const uniforms = {
            spotColor: { type: 'v3', value: new THREE.Color('#FFFFFF') },
            pointTexture: { value: pointTexture },
            cameraPosition: {
                x: 0,
                y: 9.184850993605149e-14,
                z: 1500,
            }
        };

        const material = new THREE.PointsMaterial({
            // color: '#FFFFFF',
            vertexColors: true,
            sizeAttenuation: true,
            map: pointTexture,
            size: fixedSize,
            transparent: true,
            alphaTest: 0.5,
        });


        // const material = new THREE.ShaderMaterial({
        //     uniforms,
        //     vertexShader,
        //     fragmentShader,
        //     transparent: true,
        //     fog: false,
        //     // alphaTest: 1,
        //     depthWrite: false,
        //     depthTest: false,
        //     blending: THREE.NormalBlending, // MultiplyBlending, //.SubtractiveBlending // NormalBlending // AdditiveBlending
        // });

        return material;

    },
};

