const point_fragment = `
    varying vec3 vColor; // Varying variable to receive color from vertex shader

    void main() {
        gl_FragColor = vec4(vColor, 1.0); // Set fragment color based on vertex color
    }
    `

export default point_fragment;