const point_vertex = `
attribute vec3 color;
attribute float size;

varying vec3 vColor;

void main() {
    vColor = color;

    vec4 mvZPosition = vec4(position, 1.0);
    vec4 mvPosition = modelViewMatrix * mvZPosition;

    float visibilityThreshold = 0.0; // Adjust this value based on your needs
    float distanceToCamera = length(mvPosition.xyz);

    gl_Position = projectionMatrix * mvPosition;

    // Adjust alpha instead of setting point size to 0
    if (distanceToCamera > visibilityThreshold) {
        gl_PointSize = 0.0;
    } else {
        gl_PointSize = size * (300.0 / -mvPosition.z);
    }

    // Use alpha to hide points beyond the visibility threshold
    gl_Position.z -= distanceToCamera * 0.1; // Adjust factor as needed
}
`;

export default point_vertex;



// const point_vertex = `
//     attribute vec3 color;
//     attribute float size;
    
//     varying vec3 vColor;
    
//     void main() {
//         vColor = color;
        
//         vec4 mvZPosition = vec4( position, 1.0 );
//   	    vec4 mvPosition = modelViewMatrix * vec4( mvZPosition);

//         gl_PointSize = size * ( 300.0 / -mvPosition.z );
//         gl_Position = projectionMatrix * mvPosition;        
//     } 
//     `

// export default point_vertex;



// vec4 mvZPosition = vec4(position, 1.0);
// vec4 mvPosition = modelViewMatrix * mvZPosition;

// // Get the distance between the current vertex and the camera
// float distanceToCamera = distance(cameraPosition, mvPosition.xyz);

// // Set a threshold distance for visibility
// float visibilityThreshold = 10.0; // Adjust this value based on your needs

// // If the vertex is beyond the threshold, move it to a position that won't be visible
// if (distanceToCamera > visibilityThreshold) {
//     gl_Position = vec4(0.0, 0.0, -2.0, 1.0); // You can adjust this position
// } else {
//     gl_PointSize = size * (300.0 / -mvPosition.z);
//     gl_Position = projectionMatrix * mvPosition;
// }