import { Scene } from "../../World/Scene";
import {IAssetProcessorFactory} from "../AssetProcessors/IAssetProcessorFactory"


export class SceneFactory implements IAssetProcessorFactory<Scene>{
    Create(buffer: Uint8Array): Scene {
        const ret : Scene = new Scene();
        
        return ret;
    }
}