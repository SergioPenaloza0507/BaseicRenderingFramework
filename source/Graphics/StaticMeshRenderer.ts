import { Component } from "../Component";

class StaticMeshRenderer extends Component{
    mesh : StaticMesh;

    public override Initialize() : void{

    }

    public override GetTypeName(): string {
        return "StaticMesh";
    }
}