import { mat4, vec3 } from "gl-matrix";
import { Transform } from "./Transform";
import { Component } from "./Component";

export class Camera extends Component{

    private perspective      : boolean;
    private aspect           : number;
    private size             : number;
    private fov              : number;
    private near             : number;
    private far             : number;
    private projectionMatrix : mat4;
    private viewMatrix       : mat4;

    public Initialize(): void {
        this.perspective = true;
        this.aspect = 1920 / 1080;
        this.size = 5;
        this.fov = 90;
        this.near = 0.1;
        this.far = 100;
        this.projectionMatrix = mat4.create();
        if(this.perspective){
            mat4.perspective(this.projectionMatrix, this.fov, 1920/1080, this.near, this.far);
        }
        else{
            mat4.ortho(this.projectionMatrix, -this.size * this.aspect,this.size * this.aspect, -this.size, this.size, this.near, this.far);
        }
        this.viewMatrix = mat4.create();
    }
    public GetTypeName(): string {
        return "Camera";
    }
    public get ViewMatrix() : mat4{ 
        
        const transform = this.Entity.GetComponent<Transform>(Transform);
        mat4.fromRotationTranslationScale(this.viewMatrix,transform.Rotation, transform.Position, vec3.fromValues(1,1,1));
        return this.viewMatrix;
    }

    public get ProjectionMatrix() : mat4{
        if(this.perspective){
            mat4.perspective(this.projectionMatrix, this.fov, 1920/1080, this.near, this.far);
        }
        else{
            mat4.ortho(this.projectionMatrix, -this.size * this.aspect,this.size * this.aspect, -this.size, this.size, this.near, this.far);
        }
        return this.projectionMatrix;
    }
}