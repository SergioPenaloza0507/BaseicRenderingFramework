#version 300 es

precision highp float;

in vec4 v_position;
out vec4 outColor;

void main(){
    outColor = v_position * 0.5 + 0.5;
}
