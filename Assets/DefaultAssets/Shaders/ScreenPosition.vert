#version 300 es

precision highp float;

in vec2 v_position;
out vec4 outColor;

void main(){
    outColor = vec4(v_position * 0.5 + 0.5,0,1);
}