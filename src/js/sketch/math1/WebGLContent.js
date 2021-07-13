import * as THREE from 'three';
import Camera from './Camera';

let renderer;
let ticker;
const scene = new THREE.Scene();
const size  = 30;
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const texLoader = new THREE.TextureLoader();
let points;
const colors = [
    "264653","2a9d8f","e9c46a","f4a261","e76f51",
    "e63946","f1faee","a8dadc","457b9d","1d3557",
    "3f4455",	"00ff4e",	"a200ff",	"00ff4f",	"ce00fe",	"00d700",    "d309ff",	"00df2f",	"9e30fb",	"c8ff00",	"0c00ac",    "c7fb34",	"000093",	"6dd300",	"ca00cd",	"00e24c",	"7e40df",	"00bd00",	"c15bff",	"54c500",	"6800a4",    "00ff82", "8e37d0",	"00b100",    "6367ff",	"d8ee25", "002393", "93ff6a", "590086", "00ff8f", "852cb2", "00f17c", "d546ce", "00ff9d", "be0099", "009700", "8a64f2", "ffdc02", "001c7e", "ffe038", "000058", "b3ff82", "7136b8", "1d9400", "a67cff", "008f00", "ff88ff", "008600", "ff59c2", "008500", "740082", "b4ed73", "6f007e", "fbf97b", "0039a2", "ffbb00", "007df9", "ff0000", "00ffff", "e50000", "00ffff", "e72018", "00ffff", "ff5100", "0083ff", "ffa300", "0080fb", "ffce3f", "008bff", "ff7800", "008bff", "ff9e1a", "0093ff", "ff710d", "0094ff", "e4a200", "0064cc", "bca400", "0070d9", "ff5424", "00ffff", "d00020", "00ffff", "ff006a", "00da95", "cb0077", "007f00", "ff66cd", "006800", "de85f4", "70ae30", "43005f", "afca53", "002d84", "799a00", "7b91ff", "6e8c00", "ff97ff", "005c00", "f597ff", "005600", "ff9fff", "009553", "ef274c", "00ffff", "b70003", "00ffff", "ad0002", "00ffff", "b4001d", "00fbff", "980000", "39ffff", "970007", "00f3ff", "8a0000", "00f1ff", "ff693c", "0097ff", "ff932d", "0098ff", "e9a028", "002d80", "ffef89", "2c004a", "ccd062", "002068", "ff9739", "0084e4", "ffb050", "003182", "ac9220", "003b8f", "9c8100", "ac95ff", "899b2f", "c682e4", "1ea35f", "bc0045", "00f0ff", "800000", "00efff", "911b00", "00efff", "780000", "00e8ff", "760000", "00e8ff", "780007", "00e3ff", "700000", "00e3ff", "8b001b", "00c593", "c14384", "00c79c", "28003b", "aafff1", "640000", "00d0ff", "630000", "00ccff", "fb9549", "00a7ff", "ff924e", "001652", "d2b55a", "8b9fff", "9c7a00", "5eabff", "965500", "00c1ff", "914700", "00c7ff", "610000", "00cfd3", "570000", "00caf1", "510000", "b8fef4", "30002a", "d4fbda", "2b0022", "ffebbd", "00204c", "ff9c59", "007cc9", "ffa364", "009ee7", "ff9d63", "0092d9", "855c00", "c79dff", "003e00", "ffa0f8", "003e00", "ffb4ff", "003300", "ffb8ff", "003200", "edb6ff", "002f00", "ff6f97", "00521d", "ff82a9", "002e00", "ffc9ff", "002800", "ffccff", "002300", "ffcfff", "102e00", "acaaff", "385100", "b89ef1", "715e00", "3dbaff", "4f0000", "57c2ff", "653500", "79b2ff", "685000", "7eb0ff", "e1794e", "00b0e7", "ff737c", "41bc9b", "540037", "bfebff", "3f0000", "71cfff", "360400", "ffdfff", "001a00", "ffdaff", "001800", "ffdcff", "130c00", "ffddff", "220000", "ffe7df", "001a36", "ffad6e", "003e77", "c99250", "0081c6", "a8944b", "b371c2", "2f6a2f", "e26487", "00b5c7", "5f002b", "5cbabe", "601848", "00948c", "f89380", "002f58", "c5a865", "34143f", "ffb2a9", "002b32", "ff9aa2", "003d30", "e7c2ff", "413600", "e0c1ff", "281100", "a8c7de", "2f0e00", "a59de1", "502700", "0099c0", "6e2e2a", "009eac", "9c405e", "009cb4", "e78094", "002c37", "bc5f8a", "005451", "8c97d9", "2e1800", "a4a7d8", "191718", "c2abb0", "00304d", "8b8e5a", "235986", "8f9e81", "003548", "c7a4aa", "36261c", "0085af", "84695c", "0073a1", "949f8d", "473847", "44849f", "465e57",	"007182",
	
    "f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"
].map(x =>  new THREE.Color("#"+x));
export function selectColor(i ) {
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
    
    for (var i = 0; i < size; i++) {
	for (var j = 0; j < size; j++) {
	    for (var k = 0; k < size; k++) {
		vertices_base.push(
		    (i-half)/scale,
		    (j-half)/scale,
		    (k-half)/scale);
		var c = selectColor(i+j+k) ;
		colors_base.push(c.r , c.g , c.b );
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

