export class StaticMesh{

    //#region Vertex Buffer data
    positions : number[];
    uvChannels : number[][];
    normals : number[];
    colorChannels : number[][];

    tangents : number[];
    binormals : number[];
    //#endregion

    indices : Uint16Array;
    gpuVertexBuffer : Float32Array;

    public InitializePositions(positions : number[]) : void{
        this.positions = [...positions];
    }
    public InitializeIndices(indices : number[]) : void{
        this.indices = new Uint16Array(indices);
    }
    public InitializeNormals(normals : number[]) : void{
        this.normals = [...normals];
    }
    public InitializeUvs(channels : number[][]){
        this.uvChannels = [];
        channels.forEach(channel => {
            this.uvChannels.push([...channel]);
        })
    }

    public InitializeColors(channels : number[][]){
        this.colorChannels = [];
        channels.forEach(channel => {
            this.colorChannels.push([...channel]);
        })
    }

    public InitializeBuffersPI(positions : number[], faces:number[]){
        this.InitializePositions(positions);
        this.InitializeIndices(faces);

        const bufferData : number[] = []
        var positionLookup : number = 0;
        while(positionLookup < positions.length){
            bufferData.push(positions[positionLookup])
            bufferData.push(positions[positionLookup+1])
            bufferData.push(positions[positionLookup+2])
            positionLookup+=3;
        }

        this.gpuVertexBuffer = new Float32Array(bufferData);
    }

    public InitializeBuffers(positions : number[], uvChannels:number[][], normals:number[], faces:number[]){
        this.InitializePositions(positions);
        this.InitializeUvs(uvChannels);
        this.InitializeNormals(normals);
        this.InitializeIndices(faces);

        const bufferData : number[] = []
        var positionLookup=0, uv0LookUp=0, normalLookUp=0, color0Lookup : number = 0;
        while(positionLookup < positions.length || uv0LookUp < uvChannels[0].length || normalLookUp < normals.length){
            bufferData.push(positions[positionLookup])
            bufferData.push(positions[positionLookup+1])
            bufferData.push(positions[positionLookup+2])
            positionLookup+=3;
            bufferData.push(uvChannels[0][uv0LookUp])
            bufferData.push(uvChannels[0][uv0LookUp+1])
            uv0LookUp+=2;
            bufferData.push(normals[normalLookUp])
            bufferData.push(normals[normalLookUp+1])
            bufferData.push(normals[normalLookUp+2])
            normalLookUp+=3;
        }

        this.gpuVertexBuffer = new Float32Array(bufferData);
    }

    public static PrimitiveCuve() : StaticMesh{
        const cube : StaticMesh = new StaticMesh();
        cube.InitializeBuffersPI([
            -0.5, -0.5, -0.5,   //0
            -0.5, -0.5, 0.5,    //1
            0.5, -0.5, 0.5,     //2
            0.5, -0.5, -0.5,    //3
            -0.5, 0.5, -0.5,    //4
            -0.5, 0.5, 0.5,     //5
            0.5, 0.5, 0.5,      //6
            0.5, 0.5, -0.5,     //7
        ],[
            3,1,0,
            3,2,1,
            4,5,7,
            5,6,7,
            0,5,1,
            0,4,5,
            3,4,0,
            3,7,4,
            3,2,7,
            2,6,7,
            1,5,2,
            2,5,6
        ]
        );

        return cube;
    }
}