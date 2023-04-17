import { World } from "./World";
import { Entity } from "./Entity";


export abstract class Component{
    public entity : number;

    constructor(entity : number){
        this.entity = entity;
    }

    public abstract Initialize() : void;
    public abstract GetTypeName() : string;

    public Destroy() : void{
        World.GetCurrentWorld().DestroyComponent(this.GetTypeName(), this);
    }

    public static get AllowDuplicates() : boolean{
        return true;
    }

    public get Entity() : Entity{
        return World.GetCurrentWorld().GetEntity(this.entity);
    }

}