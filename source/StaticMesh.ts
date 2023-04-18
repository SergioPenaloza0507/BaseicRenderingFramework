export class StaticMesh{
    positions : Float32Array;
    indices : Uint16Array;
    tangents : Float32Array;
    binormals : Float32Array;
    uvChannels : Float32Array[];
    colorChannels : Float32Array[];


    public static PrimitiveCuve() : StaticMesh{
        const cube : StaticMesh = new StaticMesh();
        
        cube.positions = new Float32Array([
            -0.5, -0.5, -0.5,   //0
            -0.5, -0.5, 0.5,    //1
            0.5, -0.5, 0.5,     //2
            0.5, -0.5, -0.5,    //3
            -0.5, 0.5, -0.5,    //4
            -0.5, 0.5, 0.5,     //5
            0.5, 0.5, 0.5,      //6
            0.5, 0.5, -0.5,     //7
        ]);

        cube.indices = new Uint16Array([
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
        ]);

        return cube;
    }
}