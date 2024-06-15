
export default class Constants{
    static readonly URL_V1: string = process.env.API_URL_LOCAL+"/v1";
    static readonly URL_V2: string = process.env.API_URL_LOCAL+"/v2";
    static readonly PUSHER_KEY: string = process.env.PUSHER_KEY || "";
    static readonly PUSHER_CLUSTER: string = process.env.PUSHER_CLUSTER || "";
}