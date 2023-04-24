#version 300 es

in vec4 a_POSITION0;
out vec2 v_position;
uniform mat4 _ObjectToWorldMatrix;
uniform mat4 _ViewProjectionMatrix;

void main(){
    gl_Position = _ViewProjectionMatrix * _ObjectToWorldMatrix * a_POSITION0;
    v_position = a_POSITION0.xy;
}