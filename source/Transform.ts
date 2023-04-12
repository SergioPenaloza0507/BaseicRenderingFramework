import { vec3, quat, mat4 } from "gl-matrix";
import { Component } from "./Component";

export class Transform extends Component{

    private position : vec3;
    private rotation : quat;
    private scale : vec3;
    private dirty : boolean;
    private objecToWorldMatrix : mat4;
    private worldToObjectMatrix : mat4;

    public override Initialize(): void {
        this.position = vec3.create();
        vec3.zero(this.position);
        this.rotation = quat.create();
        quat.identity(this.rotation);
        this.scale = vec3.create();
        vec3.set(this.scale,0,0,0);
        this.objecToWorldMatrix = mat4.create();
        this.worldToObjectMatrix = mat4.create();
        this.UpdateMatrices();
    }

    public static override get AllowDuplicates() : boolean {
        return false;
    }

    public override GetTypeName(): string {
        return "Transform";
    }

    private UpdateMatrices() : void{
        mat4.fromRotationTranslationScale(this.objecToWorldMatrix, this.rotation, this.position, this.scale);
        mat4.invert(this.worldToObjectMatrix, this.objecToWorldMatrix);
    }

    public get Position() : vec3{
        return this.position;
    }

    public set Position(newPosition : vec3){
        this.position = newPosition;
        this.dirty = true;
    }

    public get Rotation() : quat{
        return this.rotation;
    }

    public set Rotation(newRotation : quat){
        this.rotation = newRotation;
        this.dirty = true;
    }

    public set Scale(newScale : vec3){
        this.scale = newScale;
        this.dirty = true;
    }

    public set EulerAngles(newEuler : vec3){
        quat.fromEuler(this.rotation,newEuler[0], newEuler[1],newEuler[2]);
        this.dirty = true;
    }
}