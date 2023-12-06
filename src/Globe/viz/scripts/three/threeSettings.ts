/* 
TODO > move somewhere else
*/
const threeSettings = {
    pointCloudTexture({ origin }) {
        const texturePath = this.application.texturePath;
        const isDefined = threeSettings.textureOriginMapping.hasOwnProperty(origin);

        const textureFileName = isDefined
            ? threeSettings.textureOriginMapping[origin]
            : threeSettings.textureOriginMapping.default;

        return `${texturePath}${textureFileName}.png`;
    },

    pointSizeScale({ origin }) {
        const isDefined = threeSettings.textureScale.hasOwnProperty(origin);

        return isDefined
            ? threeSettings.textureScale[origin]
            : threeSettings.textureScale.default;
    },

    textureOriginMapping: {
        default: 'circle_50',
        survey: 'steelmark',
        ecosystem: 'circle_50',
        TOI: 'hexagon_50',
        unstructured: 'circle_50',
        structured: 'hexagon_50',
    },

    textureScale: {
        default: 1,
        survey: 12,
        TOI: 4,
    }
};

export default threeSettings;
