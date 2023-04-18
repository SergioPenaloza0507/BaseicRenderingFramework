import { quat, vec3 } from "gl-matrix";

export const DEG_2_RAD : number =  0.01745;
export const RAD_2_DEG : number =  57.296;


export function QuaternionToEuler(outVector : vec3, quaternion:quat) : vec3{

    var xEuler :number = 0;
    var yEuler :number = 0;
    var zEuler :number = 0;
    const sinrCosp : number = 2 * (quaternion[3] * quaternion[0] + quaternion[1] * quaternion[2]);
    const cosrCosp : number = 1 - 2 * (quaternion[0] * quaternion[0] + quaternion[1] * quaternion[1]);

    zEuler = Math.atan2(sinrCosp,cosrCosp);

    const sinp : number = Math.sqrt(1 + 2 * (quaternion[3] * quaternion[1] - quaternion[0] * quaternion[2]));
    const cosp : number = Math.sqrt(1 - 2 * (quaternion[3] * quaternion[1] - quaternion[0] * quaternion[2]));
    xEuler = 2 * Math.atan2(sinp,cosp) - Math.PI * 0.5;

    const sinyCosp = 2 * (quaternion[3] * quaternion[2] + quaternion[0] * quaternion[1]);
    const cosyCosp = 1 - 2 * (quaternion[1] * quaternion[1] + quaternion[2] * quaternion[2]);

    yEuler = Math.atan2(sinyCosp,cosyCosp);

    return vec3.set(outVector, xEuler,yEuler,zEuler);
}