import { mat4 } from "gl-matrix";
import { Camera } from "../Camera";
import { StaticMeshRenderer } from "./StaticMeshRenderer";
import { Shader, ShaderSemantic } from "./Shader";

export const OBJECT_TO_WORLD_NAME = "_ObjectToWorldMatrix";
export const VIEW_PROJECTION_NAME = "_ViewProjectionMatrix";

export function DrawRenderer(gl:WebGL2RenderingContext, renderer : StaticMeshRenderer, camera: Camera){
    if(renderer == null || renderer == undefined) return;
    if(renderer.Material == null || renderer == undefined) return;
    if(renderer.Material.Shader == null || renderer.Material.Shader == undefined) return;
    if(!renderer.Material.Shader.ValidateAttributeLocation(ShaderSemantic.POSITION, 0)) return;
    
    const vbo : WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, renderer.Mesh.positions, gl.STATIC_DRAW);
    
    const vao : WebGLVertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const position0Location = renderer.Material.Shader.GetVertexAttributeLocation(ShaderSemantic.POSITION,0);
    gl.enableVertexAttribArray(position0Location);
    gl.vertexAttribPointer(position0Location, 3, gl.FLOAT, false, 0, 0);

    const ebo : WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, renderer.Mesh.indices, gl.STATIC_DRAW);


    gl.useProgram(renderer.Material.Shader.shaderProgram);
    const objectToWorldMatrixLoc : WebGLUniformLocation = gl.getUniformLocation(renderer.Material.Shader.shaderProgram, OBJECT_TO_WORLD_NAME);
    const viewProjectionMatrixLoc : WebGLUniformLocation = gl.getUniformLocation(renderer.Material.Shader.shaderProgram, VIEW_PROJECTION_NAME);
    gl.uniformMatrix4fv(objectToWorldMatrixLoc, false,renderer.Transform.ObjectToWorldMatrix);
    gl.uniformMatrix4fv(viewProjectionMatrixLoc, false, mat4.mul(mat4.create(), camera.ProjectionMatrix, camera.ViewMatrix));

    gl.bindVertexArray(vao);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, renderer.Mesh.indices.length, gl.UNSIGNED_SHORT, 0);

}