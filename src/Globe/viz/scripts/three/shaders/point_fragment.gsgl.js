const point_fragment = `
    uniform sampler2D pointTexture;
    uniform vec3 spotColor;

    varying vec3 vColor;
        
    void main() {        
        vec4 textureAlpha = texture2D(pointTexture, gl_PointCoord).aaaa;
        vec4 colorRestore = vec4(1.0 - textureAlpha.r, 1.0 - textureAlpha.g, 1.0 - textureAlpha.b, 0) + textureAlpha;
        
        gl_FragColor = colorRestore * vec4(vColor, 1); 
    }
    `

export default point_fragment;