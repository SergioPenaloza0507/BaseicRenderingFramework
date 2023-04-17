import { vec3, quat, mat4 } from "gl-matrix";
import { Component } from "./Component";
import { QuaternionToEuler } from "./GeometryUtils";

export class Transform extends Component{

    private position : vec3 = vec3.create();
    private rotation : quat = quat.create();
    private scale : vec3 = vec3.create();
    private dirty : boolean = false;
    private objectToWorldMatrix : mat4 = mat4.create();
    private worldToObjectMatrix : mat4 = mat4.create();

    public constructor(entityId : number){
        super(entityId);
        this.position = vec3.create();
        vec3.zero(this.position);
        this.rotation = quat.identity(quat.create());
        quat.identity(this.rotation);
        this.scale = vec3.fromValues(1,1,1);
        this.objectToWorldMatrix = mat4.create();
        this.worldToObjectMatrix = mat4.create();
        this.UpdateMatrices();
    }

    public override Initialize(): void {
        
    }

    public static override get AllowDuplicates() : boolean {
        return false;
    }

    public override GetTypeName(): string {
        return "Transform";
    }

    private UpdateMatrices() : void{
        mat4.fromRotationTranslationScale(this.objectToWorldMatrix, this.rotation, this.position, this.scale);
        mat4.invert(this.worldToObjectMatrix, this.objectToWorldMatrix);
        console.log(`Matrices Updated!, O2W: ${this.objectToWorldMatrix}, W2O: ${this.worldToObjectMatrix}`);
    }
//#region Properties
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

    public get Scale() : vec3{
        return this.scale;
    }

    public set Scale(newScale : vec3){
        this.scale = newScale;
        this.dirty = true;
    }

    public get ObjectToWorldMatrix() : mat4{
        return this.objectToWorldMatrix;
    }

    public get WorldToObjectMatrix() : mat4{
        return this.worldToObjectMatrix;
    }

    public EulerAngles(outVector : vec3) : vec3{
        return QuaternionToEuler(outVector, this.rotation);
    }

    public SetEulerAngles(x : number,y : number,z : number) : void {
        this.rotation = quat.fromEuler(this.rotation, x,y,z);
    }
//#endregion
}