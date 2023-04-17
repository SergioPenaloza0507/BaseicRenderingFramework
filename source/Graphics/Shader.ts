export enum ShaderSemantic{
    BINORMAL = "a_BINORMAL",
    COLOR = "a_COLOR",
    NORMAL = "a_NORMAL",
    POSITION = "a_POSITION",
    PSIZE = "a_PSIZE",
    TANGENT = "a_TANGENT",
    TEXCOORD = "a_TEXCOORD"
}

export class Shader{
    shaderProgram : WebGLProgram;
    private geometryAttributes : {[name:string] : number};

    constructor(vertexSource:string, fragmentSource:string, gl:WebGL2RenderingContext, createGPUOject:boolean = true){
        this.geometryAttributes = {};
        const vertexShader = this.createGPUShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createGPUShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        this.shaderProgram = this.createGPUShaderProgram(gl, vertexShader, fragmentShader);
        [...vertexSource.matchAll(/in.*\ a[_].*[;]/g)].forEach(element => {
            const matchName : string = element[0].match(/(?<= )([0-9a-zA-Z\_]*)(?=;)/)[0];
            this.geometryAttributes[matchName] = gl.getAttribLocation(this.shaderProgram, matchName);
       })
    }

    
    public GetVertexAttributeLocation(attributeType:ShaderSemantic, index : number) : number{
        return this.geometryAttributes[`${attributeType}${index}`];
    }

    public ValidateAttributeLocation(attributeType : ShaderSemantic, index:number) : boolean
    {
        const attrib : string = `${attributeType}${index}`;
        return this.geometryAttributes.hasOwnProperty(attrib);
    }

    private createGPUShader(gl:WebGL2RenderingContext, type:GLenum, source:string) : WebGLShader{
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
        if(success){
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    private createGPUShaderProgram(gl:WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader) : WebGLProgram{
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(success){
            return program;
        }
    
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}