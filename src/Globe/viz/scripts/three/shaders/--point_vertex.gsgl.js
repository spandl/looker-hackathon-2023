// Vertex Shader
const point_vertex = `
        uniform float pointSize; // Custom uniform for point size

        attribute float size; // Custom attribute for point size
        attribute vec3 color; // Custom attribute for point color

        varying vec3 vColor; // Varying variable to pass color to fragment shader

        void main() {
            vColor = color; // Pass color to fragment shader

            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (pointSize / length(mvPosition.xyz)); // Adjust point size based on distance
            gl_Position = projectionMatrix * mvPosition;
        }
    `

export default point_vertex;