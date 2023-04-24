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
import { AssetLoader } from "./AssetIO/AssetLoader";
import { StaticMeshObjFactory } from "./AssetIO/AssetProcessors/StaticMeshOBJFactory";

var canvas : HTMLCanvasElement = document.querySelector("#c");
const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

if(!gl){
    prompt("WebGL2 is not supported");
}

async function obtenerCoso(){
    const response = await fetch("../Assets/DefaultAssets/Shaders/NoColor.frag");
    const test = (await response.body.getReader().read()).value;
    console.log(String.fromCharCode(...test));
}

obtenerCoso();
var vertexShaderSource = `#version 300 es

in vec4 a_POSITION0;
in vec2 a_TEXCOORD0;
in vec3 a_NORMAL0;

out vec3 normalWS;
out vec3 positionVS;

uniform mat4 _ObjectToWorldMatrix;
uniform mat4 _WorldToObjectMatrix;
uniform mat4 _WorldToViewMatrix;
uniform mat4 _ViewProjectionMatrix;

void main(){
    gl_Position = _ViewProjectionMatrix * _ObjectToWorldMatrix * a_POSITION0;
    normalWS = (transpose(_WorldToObjectMatrix) * vec4(a_NORMAL0,0)).xyz;
    positionVS = (_WorldToViewMatrix*_ObjectToWorldMatrix* a_POSITION0).xyz;
}
`;
var fragmentShaderSource = `#version 300 es

precision highp float;

in vec3 normalWS;
in vec3 positionVS;
out vec4 outColor;

void main(){
    vec3 lightDir = normalize(vec3(1,1,-1));
    vec3 h = normalize(normalize(positionVS) + lightDir);
    float lambert = clamp(dot(normalize(normalWS), lightDir),0.0,1.0);
    float blinnPhong = clamp(dot(normalWS, h),0.0,1.0);
    blinnPhong = clamp(pow(blinnPhong,50.0),0.0,1.0);
    float lighting = lambert+blinnPhong;
    outColor = vec4(lighting,lighting,lighting,1);
}
`;

const objImporter : StaticMeshObjFactory = new StaticMeshObjFactory();
AssetLoader.LoadAsset("../Assets/DefaultAssets/3D/Suzanne/Suzanne.obj", (buffer : Uint8Array) => {Main(objImporter.Create(buffer))}, console.log)

function Main(mesh : StaticMesh){
    const world : World = new World();
    var mainCameraEntity : Entity = Entity.Create("MainCamera");
    var cameraTransform : Transform = mainCameraEntity.AddComponent<Transform>(Transform);
    cameraTransform.Position = vec3.fromValues(0,0,-1);
    var camera : Camera = mainCameraEntity.AddComponent<Camera>(Camera);
    mainCameraEntity.AddComponent<Camera>(Camera);

    var cubeEntity : Entity = Entity.Create("Cube");
    var cubeTransform : Transform = cubeEntity.AddComponent<Transform>(Transform);
    cubeTransform.Position = vec3.fromValues(0,0,0);

    var cubeRenderer : StaticMeshRenderer = cubeEntity.AddComponent<StaticMeshRenderer>(StaticMeshRenderer);
    cubeRenderer.Mesh = mesh;

    var shader : Shader = new Shader(vertexShaderSource, fragmentShaderSource, gl);
    cubeRenderer.Material = new Material(shader);
    drawScene(gl, [cubeRenderer], camera);
}

function drawScene(gl : WebGL2RenderingContext,renderers : StaticMeshRenderer[], camera : Camera){
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.55,0.68,0.83,1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    renderers.forEach(rend => {
        rend.Entity.GetComponent<Transform>(Transform).Rotate(0,90*0.016,0);
        DrawRenderer(gl, rend, camera);
    })
    
    requestAnimationFrame(() => drawScene(gl, renderers, camera));
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