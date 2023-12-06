import * as THREE from 'three';
import * as d3 from 'd3';

import point_vertex from './shaders/point_vertex.gsgl';
import point_fragment from './shaders/point_fragment.gsgl';

import { base64Images } from '../base64Images';

import { ITableData, ITableHeaderExtended, ITableDataRow } from '../../../looker/types'

export const geoPoints = {

    createPointCloud: (data: ITableData) => {
        const { headers, rows } = data;

        const colorArray = ['#FF0000', '#ff6361', '#bc5090', '#58508d', '#003f5c']
        const tableHeaders: ITableHeaderExtended[] = headers.map((d, index) => ({
            ...d, index
        }))

        const geometry = geoPoints.createPointGeometry(rows, tableHeaders, colorArray);
        const material = geoPoints.createShaderMaterial();

        const pointCloud = new THREE.Points(geometry, material);
        pointCloud.frustumCulled = false;

        return pointCloud;
    },

    createPointGeometry: (rows: Array<ITableDataRow>, tableHeaders: ITableHeaderExtended[], colorArray: string[]) => {
        const metricField = tableHeaders.find((d) => d.configId === 'metric');
        const metricIndex = metricField.index

        const geoField = tableHeaders.find((d) => d.configId === 'geoLocation');
        const geoIndex = geoField.index

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

        /* 
        TODO > move this loop where we update the viz
        */
        rows.forEach((element, index) => {
            // COLORS
            const colorCode = colorArray[0]; // rework for dimension breakdown
            const color = new THREE.Color(colorCode);

            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;

            // GEO LOCATION
            const geoLocation = element[geoIndex].split(',')
            const { x, y, z } = Tools.getCoordinatesFromLatLng(Number(geoLocation[0]), Number(geoLocation[1]), 400)

            const t = 1
            positions[index * 3] = x * t;
            positions[index * 3 + 1] = y * t;
            positions[index * 3 + 2] = z * t;

            // SIZE
            sizes[index] = metricScale(element[metricIndex]);
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

    createShaderMaterial: () => {

        const vertexShader = point_vertex;
        const fragmentShader = point_fragment;

        const uniforms = {
            spotColor: { type: 'v3', value: new THREE.Color('#FFFFFF') },
            pointTexture: { value: new THREE.TextureLoader().load(base64Images.pointTexture) },
            cameraPosition: {
                x: 0,
                y: 9.184850993605149e-14,
                z: 1500,
            }
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            fog: false,
            depthTest: false,
            blending: THREE.NormalBlending, // MultiplyBlending, //.SubtractiveBlending // NormalBlending // AdditiveBlending
        });

        return material;

    },
};

export type TExtent = [number, number];
const Tools = {

    getCoordinatesFromLatLng: (latitude: number, longitude: number, radiusEarth: number) => {
        let latitude_rad = (latitude * Math.PI) / 180;
        let longitude_rad = (longitude - 180) * Math.PI / 180;

        let xPos = -1 * radiusEarth * Math.cos(latitude_rad) * Math.cos(longitude_rad);
        let yPos = radiusEarth * Math.sin(latitude_rad);
        let zPos = radiusEarth * Math.cos(latitude_rad) * Math.sin(longitude_rad);

        return { x: xPos, y: yPos, z: zPos };
    },

    normalizeExtent: (extent: TExtent): TExtent => {
        const [min, max] = extent;

        if (min < 0 && max > 0) {
            return extent;
        }
        // Non-divergent extent, normalize to 0-based
        const normalizedMin = Math.min(min, 0);
        const normalizedMax = Math.max(max, 0);
        return [normalizedMin, normalizedMax];
    }

};