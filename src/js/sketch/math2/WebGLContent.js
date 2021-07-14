import * as THREE from 'three';
import Camera from './Camera';

let renderer;
let ticker;
const scene = new THREE.Scene();
const size  = 5;
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const texLoader = new THREE.TextureLoader();
let points;
var colors = []

export function createColors() {
    const csize = 255*10;
    const stepsize = 100;
    for (var i = 0; i < size; i+=stepsize) {
	for (var j = 0; j < size; j+=stepsize) {
	    for (var k = 0; k < size; k+=stepsize) {
		var c = new THREE.Color();
		c.r = i % csize;
		c.g = j % csize;
		c.b = k % csize;
		colors.push(c);
		console.log("init",i,j,k,[c.r,c.g,c.b])
	    }
	}
    }    
}

export function selectColor(i) {
    
    return colors[i % colors.length];
}
// from https://stackoverflow.com/q/65051048
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


export function createPoints( canvas ) {
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    var colors_base = [];
    var masses_base = [];
    var half = Math.floor(size/2);
    var scale = 1.6666;
    var col = 0;
    for (var i = 0; i < size; i++) {
	for (var j = 0; j < size; j++) {
	    for (var k = 0; k < size; k++) {
		col = col + 1;
		vertices_base.push(
		    (i-half)/scale,
		    (j-half)/scale,
		    (k-half)/scale);
		var c = selectColor(col) ;
		colors_base.push(c.r , c.g , c.b );
		console.log("use",i,j,k,[c.r,c.g,c.b])
		masses_base.push(200);
	    }
	}
    }
    var vertices = new Float32Array(vertices_base);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    var colors = new Float32Array(colors_base);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    var material = new THREE.PointsMaterial({
	//map : tex,
	vertexColors: THREE.VertexColors,
	size:1,
    });
    return new THREE.Points(geometry, material);
}

export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
      renderer = new THREE.WebGL1Renderer({
	  alpha: true,
	  antialias: true,
	  canvas: canvas,
      });
      createColors();
      renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x0e0e0e, 1.0);
      
      points = createPoints(canvas);

      var light = new THREE.AmbientLight('white');
      scene.add(light);
      
      scene.add(points);
      
      camera.start();
  }
  play() {
      clock.start();
      ticker = 1;
    this.update();
  }
  pause() {
    clock.stop();
  }
  update() {
    // When the clock is stopped, it stops the all rendering too.
      if (clock.running === false) return;

      const time = clock.getDelta();
      ticker = ticker + 1;
      
      camera.update(time);

      points.rotation.x += 0.01;
      points.rotation.y += 0.01;
      points.rotation.z += 0.01;
      const colorb = points.geometry.attributes.color;
      
      const colorsa = colorb.array;
      var idx = 0;
      for (var i = 0; i < colorsa.length; i++) {
	  //var c = selectColor(i+ ticker);
	  var v = colorsa[ i ] + 0.001;
	  //console.log("inc",i, colorsa[ i ])
	  if (v > 1) {
	      v = 0;
	  }
	  colorsa[ i ] = v;
      }
      //points.updateMatrix();
      colorb.needsUpdate= true;
      
      
      renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}

