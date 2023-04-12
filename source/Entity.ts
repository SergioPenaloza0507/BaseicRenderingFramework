import { Component } from "./Component";
import { World } from "./World";

export class Entity{
    name : string
    id : number

    constructor(name : string, id : number){
        this.name = name;
        this.id = id;
    }

    AddComponent<Type extends Component>(Type : {new(entity : number) : Type}) : Type{
        return World.GetCurrentWorld().AddEntityComponent(Type, this.id);
    }

    GetComponent<Type extends Component>(Type : {new(entity : number) : Type}) : Type{
        return World.GetCurrentWorld().GetEntityComponent<Type>(Type, this.id);
    }

    public static Create(name : string, staticMemory : boolean = true) : Entity{
        return World.GetCurrentWorld().CreateEntity(name, staticMemory);
    }

    public Destroy() : void {
        World.GetCurrentWorld().DestroyEntity(this.id, true);
    }
};