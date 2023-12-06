const point_vertex = `
    attribute vec3 color;
    attribute float size;
    
    varying vec3 vColor;
    
    void main() {
        vColor = color;
        
        vec4 mvZPosition = vec4( position, 1.0 );
  	    vec4 mvPosition = modelViewMatrix * vec4( mvZPosition);

        gl_PointSize = size * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;        
    } 
    `

export default point_vertex;