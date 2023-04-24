import { StaticMesh } from "../StaticMesh";

export namespace AssetLoader{
    export async function LoadAsset(path : string, onLoaded : Function, onFailed : Function){
        var arrayBuffer : Uint8Array =  (await (await fetch(path)).body.getReader().read()).value;
        if(arrayBuffer == null || arrayBuffer == undefined){
            onFailed("Failed To Load :(");
        }
        else{
            onLoaded(arrayBuffer);
        }
    }
}