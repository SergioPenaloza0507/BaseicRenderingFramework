import { vec2, vec3 } from "gl-matrix";
import { StaticMesh } from "../../StaticMesh";
import { IAssetProcessorFactory } from "./IAssetProcessorFactory";

enum PivotBuffer{
        Vertex,
        Normal,
        UV,
        Face
}
export class StaticMeshObjFactory implements IAssetProcessorFactory<StaticMesh>{
    

    public Create(buffer : Uint8Array) : StaticMesh {
        var modelString : string = "";
        for(let i = 0; i < buffer.length; i++){
            modelString += String.fromCharCode(buffer[i]);
        }
        

        const ret : StaticMesh = new StaticMesh();

        var vertexDefinitions : string[] = [...modelString.matchAll(/v .*/g)].map(match => {return match[0]}); 
        var normalDefinitions : string[] = [...modelString.matchAll(/vn .*/g)].map(match => {return match[0]}); 
        var uvDefinitions : string[] = [...modelString.matchAll(/vt .*/g)].map(match => {return match[0]}); 
        var faceDefinitions : string[] = [...modelString.matchAll(/f .*/g)].map(match => {return match[0]});
        
        const bufferCollection : string[][] = [vertexDefinitions, normalDefinitions, uvDefinitions, faceDefinitions];
        var largestBuffer : number = 0;
        for(let i = 0; i < bufferCollection.length; i++){
            if(bufferCollection[i].length > bufferCollection[largestBuffer].length){
                largestBuffer = i;
            }
        }

        const vertexObjData : number[][] = vertexDefinitions.map(definition => {
            const splitComponents: string[] = definition.replace("v ", "").split(" ");
            return [Number(splitComponents[0]), Number(splitComponents[1]), Number(splitComponents[2])];
        })

        const normalObjData : number[][] = normalDefinitions.map(definition => {
            const splitComponents: string[] = definition.replace("vn ", "").split(" ");
            return [Number(splitComponents[0]), Number(splitComponents[1]), Number(splitComponents[2])];
        })

        const uvObjData : number[][] = uvDefinitions.map(definition => {
            const splitComponents: string[] = definition.replace("vt ", "").split(" ");
            return [Number(splitComponents[0]), Number(splitComponents[1])];
        })

        const faceObjData : number[][][] = faceDefinitions.map(definition => {
            return definition.replace("f ", "").split(" ").map(vert => {
                return vert.split("/").map(Number);
            });
        })


        const vertexBufferData : number[] = [];
        const normalBufferData : number[] = [];
        const uvBufferData : number[] = [];
        const faceBufferData : number[]  = [];

        faceObjData.forEach(element => {
            for(let faceComponentIndex = 0; faceComponentIndex < element.length; faceComponentIndex++){
                const faceComponent = element[faceComponentIndex];
                for(let componentCategory = 0; componentCategory < faceComponent.length; componentCategory++){
                    var index : number = faceComponent[componentCategory];
                    if(index <= 0) continue;
                    index--;
                    if(componentCategory == 0){
                        vertexObjData[index].forEach(comp =>
                            vertexBufferData.push(comp)
                        );
                        faceBufferData.push((vertexBufferData.length / 3) - 1);
                    }
                    if(componentCategory == 1){
                        uvObjData[index].forEach(comp =>
                            uvBufferData.push(comp)
                        );
                    }
                    if(componentCategory == 2){
                        normalObjData[index].forEach(comp =>
                            normalBufferData.push(comp)
                        );
                    }
                }
            }
        });

        ret.InitializeBuffers(vertexBufferData, [uvBufferData], normalBufferData, faceBufferData);
        return ret;
    }
} 