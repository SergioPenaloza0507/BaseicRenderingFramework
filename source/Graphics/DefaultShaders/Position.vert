#version 300 es

in vec4 a_position;
uniform mat4 _ObjectToWorldMatrix;
uniform mat4 _WorldToViewMatrix;
uniform mat4 _ViewToProjectionMatrix;

void main(){
    gl_Position = a_position * (_ObjectToWorldMatrix * _WorldToViewMatrix * _ViewToProjectionMatrix);
}