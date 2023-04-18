import { vec3 , mat4} from "gl-matrix";
import { World } from "./World";
import { Entity } from "./Entity";
import { Camera } from "./Camera";
import { Transform } from "./Transform";
import {Shader} from "./Graphics/Shader";
import { StaticMesh } from "./StaticMesh";
import { StaticMeshRenderer } from "./Graphics/StaticMeshRenderer";
import { Material } from "./Material";
import { DrawRenderer } from "./Graphics/Graphics";

var canvas : HTMLCanvasElement = document.querySelector("#c");
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

if(!gl){
    prompt("WebGL2 is not supported");
}

async function obtenerCoso(){
    const response = await fetch("../source/Graphics/DefaultShaders/NoColor.frag");
    const test = (await response.body.getReader().read()).value;
    console.log(String.fromCharCode(...test));
}

obtenerCoso();
var vertexShaderSource = `#version 300 es

in vec4 a_POSITION0;
out vec2 v_position;
uniform mat4 _ObjectToWorldMatrix;
uniform mat4 _ViewProjectionMatrix;

void main(){
    gl_Position = _ViewProjectionMatrix * _ObjectToWorldMatrix * a_POSITION0;
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
cameraTransform.Position = vec3.fromValues(0,0,-2);
var camera : Camera = mainCameraEntity.AddComponent<Camera>(Camera);
mainCameraEntity.AddComponent<Camera>(Camera);

var cubeEntity : Entity = Entity.Create("Cube");
var cubeTransform : Transform = cubeEntity.AddComponent<Transform>(Transform);
cubeTransform.Position = vec3.fromValues(0,0,0);

var cubeRenderer : StaticMeshRenderer = cubeEntity.AddComponent<StaticMeshRenderer>(StaticMeshRenderer);
cubeRenderer.Mesh = StaticMesh.PrimitiveCuve();

var shader : Shader = new Shader(vertexShaderSource, fragmentShaderSource, gl);
cubeRenderer.Material = new Material(shader);

drawScene();

function drawScene(){

    cubeTransform.Rotate(0 , 3, 0);

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    DrawRenderer(gl, cubeRenderer, camera);
    requestAnimationFrame(drawScene);
}

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