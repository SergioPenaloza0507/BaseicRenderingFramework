import { Shader } from "./Graphics/Shader";

export class Material{
    private shader : Shader;

    constructor(shader : Shader){
        this.shader = shader;
    }

    public get Shader() : Shader{
        return this.shader;
    }
}