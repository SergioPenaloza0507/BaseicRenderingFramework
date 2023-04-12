import { vec3 } from "gl-matrix";
import { World } from "./World";
import { Entity } from "./Entity";
import { Camera } from "./Camera";
import { Transform } from "./Transform";

var canvas : HTMLCanvasElement = document.querySelector("#c");
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

if(!gl){
    prompt("WebGL2 is not supported");
}

var vertexShaderSource = `#version 300 es

in vec4 a_POSITION0;
out vec2 v_position;

void main(){
    gl_Position = a_POSITION0;
    v_position = a_POSITION0.xy;
}
`;
var fragmentShaderSource = `#version 300 es

precision highp float;

in vec2 v_position;
out vec4 outColor;

void main(){
    outColor = vec4(v_position * 0.5 + 0.5,0,1);
}
`;

const world : World = new World();

var mainCameraEntity : Entity = Entity.Create("MainCamera");
var cameraTransform : Transform = mainCameraEntity.AddComponent<Transform>(Transform);
cameraTransform.Position = vec3.fromValues(0,0,-10);
mainCameraEntity.AddComponent<Camera>(Camera);



var shader : Shader = new Shader(vertexShaderSource, fragmentShaderSource, gl);

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
    -1,-1,0,
    -1,1,0,
    1,-1,0,
    1,-1,0,
    -1,1,0,
    1,1,0
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

var vao = gl.createVertexArray();
gl.bindVertexArray(vao);
if(shader.ValidateAttributeLocation(ShaderSemantic.POSITION,0))
{
gl.enableVertexAttribArray(shader.GetVertexAttributeLocation(ShaderSemantic.POSITION,0));
}

var size = 3;
var type = gl.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;

gl.vertexAttribPointer(shader.GetVertexAttributeLocation(ShaderSemantic.POSITION,0), size, type, normalize, stride, offset);

resizeCanvasToDisplaySize(canvas);
gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
gl.clearColor(0,0,0,0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(shader.shaderProgram);
gl.bindVertexArray(vao);
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6
gl.drawArrays(primitiveType, offset, count);

function resizeCanvasToDisplaySize(canvas:HTMLCanvasElement){
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if(needResize){
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}