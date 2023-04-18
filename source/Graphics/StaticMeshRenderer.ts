import { Component } from "../Component";
import { StaticMesh } from "../StaticMesh";
import { Material } from "../Material";

export class StaticMeshRenderer extends Component
{
    private mesh : StaticMesh;
    private materials : Material[];

    constructor(entityId : number){
        super(entityId);
        this.materials = [];
    }

    public override Initialize() : void{
        
    }

    public override GetTypeName(): string {
        return "StaticMesh";
    }

    public SetRenderState(gl : WebGL2RenderingContext) : void {

    }

    public get Material() : Material{
        return this.materials[0];
    }

    public set Material(material : Material) {
        if(this.materials.length <= 0){
            this.materials = this.materials.concat(material);
        }

        this.materials[0] = material;
    }

    public get Mesh() : StaticMesh{
        return this.mesh;
    }

    public set Mesh(mesh : StaticMesh){
        this.mesh = mesh;
    }
}