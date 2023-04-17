import { Entity } from "./Entity";
import { Component } from "./Component";

export class World{
    private staticEntities : Entity[];

    private disposedEntities : number[];

    private components : {[type : string] : Component[]};

    private disposedComponents : {[type : string] : Component[]};

    private static currentWorld : World;

    constructor(){
        this.staticEntities = new Array<Entity>(0);
        this.disposedEntities = [];
        this.components = {};
    }

    public GetEntity(entityId : number) : Entity{
        try{
        return this.staticEntities[entityId];
        }
        catch(e){
            return null;
        }
    }

    /**
     * Picks an entity array based on which type of entity is needed
     * @param staticMemory Determines which entity array to choose
     * @returns chosen entity array
     */
    private PickEntityArray(staticMemory : boolean) : Entity[]{
        return this.staticEntities;
    }

    /**
     * Registers a new component under a specific entity ID
     * @param Type Type of component to be registered
     * @param entityId Entity id for component registration
     * @returns newly registered component as Type or null if component class doesn't allow duplicates and a component of type Type is already registered under entityId
     */
    public AddEntityComponent<Type extends Component>(Type : {new(entity : number) : Type}, entityId : number) : Type{
        if(!this.components[Type.name]){
            this.components[Type.name] = [];
        }
        if(this.GetEntityComponent<Type>(Type,entityId) != null){
            if(!Type.prototype.AllowDuplicates) {
                return null;
            }
        }

        if(!this.components[Type.name]) this.components[Type.name] = [];
        this.components[Type.name] = this.components[Type.name].concat(new Type(entityId));
        return this.GetEntityComponent<Type>(Type, entityId);
    }

    public GetAllEntityComponents(entityId : number) : Component[]{
        const ret : Component[] = [];
        for(let t in this.components){
            ret.concat(this.components[t].filter(element => element.entity == entityId));
        }
        return ret;
    }

    public GetAllEntityComponentIndices(entityId : number) : {[type:string] : number[]}{
        const ret : {[type:string] : number[]} = {};
        for(let t in this.components){
            ret[t] = [];
            for(let i = 0; i < ret[t].length; i++){
                if(this.components[t][i].entity = entityId){
                    ret[t].concat(i);
                }
            }
        }
        return ret;
    }

    /**
     * Fetches a component registered under an entity Id
     * @param Type Type of the component to be fetched
     * @param entityId Entity id under which the desired component is supposed to be registered
     * @returns Component as Type if it's found, otherwise null
     */
    public GetEntityComponent<Type extends Component>(Type : {new(entity : number) : Type}, entityId : number) : Type {
        return this.components[Type.name].find(element => element.entity == entityId) as Type;
    }

    /**
     * Creates a new entity and registers it into the world ensuring memory density
     * @param name new Entity's name
     * @param staticMemory 
     * @returns new Entity
     */
    public CreateEntity(name:string, staticMemory : boolean) : Entity{
        const entityArray = this.PickEntityArray(staticMemory);
        const newArray = new Array<Entity>(entityArray.length+1);
        for(let i = 0; i < entityArray.length; i++){
            newArray[i] = entityArray[i];
        }
        const newId : number = entityArray.length <= 0? 0 : entityArray.length - 1;
        newArray[newId] = new Entity(name, newId);
        delete this.staticEntities;
        this.staticEntities = newArray;
        return this.staticEntities[newId];
    }

    private CheckEntityValidity(entity : Entity):boolean{
        return !this.disposedEntities.includes(entity.id);
    }

    /**
     * Marks an entity Component for deletion
     * @param Type the Type of the deleted Component
     * @param component The component to be deleted
     */
    public DestroyComponentG<Type extends Component>(Type : (new() => Type) , component : Type) : void{
        this.DestroyComponent(Type.name, component);
    }

    /**
     * Marks an entity Component for deletion
     * @param type the Type name of the deleted Component
     * @param component The component to be deleted
     */
    public DestroyComponent(type : string, component : Component) : void{
        this.disposedComponents[type].concat(component);
    }

    /**
     * Removes all references from components that have been disposed
     * (Called at the end of a frame after Entity disposal)
     */
    public DisposeDestroyedComponents() : void{
        for(let t in this.components){
            const componentArray = this.components[t];
            const newComponentArray = new Array<Component>(componentArray.length -1);
            for(let i = 0; i < componentArray.length; i++){
                if(this.disposedComponents[t].includes(componentArray[i])){
                    continue;
                }
                newComponentArray[i] = componentArray[i];
            }
            delete this.components[t];
            this.components[t] = newComponentArray;
        }

        
        delete this.disposedComponents;
    }


    public DestroyEntity(entityId : number, staticMemory : boolean) : void{
        // Move entity to a marked for deletion array
        this.disposedEntities.concat(entityId);
    }

    /**
     * Removes all references from entities that have been disposed
     * (Called at the end of a frame)
     */
    private DisposeDestroyedEntities() : void{
        const newArray = new Array<Entity>(this.staticEntities.length - this.disposedEntities.length);
        for(let i = 0; i < this.staticEntities.length; i++){
            if(this.disposedEntities.includes(i)) {
                this.GetAllEntityComponents(i).forEach(component => {
                    this.DestroyComponent(component.GetTypeName(), component);
                })
            }
            else{
                newArray[i] = this.staticEntities[i];
                const previousId : number = newArray[i].id;
                this.GetAllEntityComponents(previousId).forEach(component => {
                    component.entity = i;
                })
                
                newArray[i].id = i;
            }
            
        }
        delete this.disposedEntities;
        delete this.staticEntities;
        this.staticEntities = newArray;
        this.disposedEntities = [];
    }

    public static GetCurrentWorld() : World{
        if(this.currentWorld == null){
            this.currentWorld = new World();
        }
        return this.currentWorld;
    }
}