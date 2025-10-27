var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext('webgl');
if(!gl){ console.error("Unable to initialize WebGL."); }
var time = 0.0;

var vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
var fragmentSource = `
precision highp float;
#define AA
uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);
uniform float time;
void main(){
  float strength = 0.4;
  float t = time/6.0;
  vec3 col = vec3(0);
  vec2 fC = gl_FragCoord.xy;
  #ifdef AA
  for(int i = -1; i <= 1; i++) {
    for(int j = -1; j <= 1; j++) {
      fC = gl_FragCoord.xy+vec2(i,j)/3.0;
  #endif
      vec2 pos = fC/resolution.xy;
      pos.y /= resolution.x/resolution.y;
      pos = 4.0*(vec2(0.5) - pos);
      for(float k = 1.0; k < 7.0; k+=1.0){ 
        pos.x += strength * sin(2.0*t+k*1.5 * pos.y)+t*0.5;
        pos.y += strength * cos(2.0*t+k*1.5 * pos.x);
      }
      col += 0.5 + 0.5*cos(time+pos.xyx+vec3(0,2,4));
  #ifdef AA
    }
  }
  col /= 9.0;
  #endif
  col = pow(col, vec3(0.4545));
  gl_FragColor = vec4(col,1.0);
}
`;

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle, window.innerWidth);
  gl.uniform1f(heightHandle, window.innerHeight);
}
function compileShader(shaderSource, shaderType){
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}
function getAttribLocation(program, name) {
  var attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw 'Cannot find attribute ' + name + '.';
  }
  return attributeLocation;
}
function getUniformLocation(program, name) {
  var attributeLocation = gl.getUniformLocation(program, name);
  if (attributeLocation === -1) {
    throw 'Cannot find uniform ' + name + '.';
  }
  return attributeLocation;
}
var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
var vertexData = new Float32Array([
  -1.0,  1.0,
  -1.0, -1.0,
   1.0,  1.0,
   1.0, -1.0,
]);
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
var positionHandle = getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);
var timeHandle = getUniformLocation(program, 'time');
var widthHandle = getUniformLocation(program, 'width');
var heightHandle = getUniformLocation(program, 'height');
gl.uniform1f(widthHandle, window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);
var lastFrame = Date.now();
var thisFrame;
function draw(){
  thisFrame = Date.now();
  time += (thisFrame - lastFrame)/770;
  lastFrame = thisFrame;
  gl.uniform1f(timeHandle, time);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(draw);
}
draw();
