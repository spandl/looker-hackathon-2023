export type TExtent = [number, number];
export const Tools = {

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