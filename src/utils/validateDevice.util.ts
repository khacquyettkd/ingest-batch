const { devicesList, apisKey, databases} = require( "../config/devices.config");
const validateDevice = (deviceId:number,apiKey:string)=>{
    if(!deviceId || !apiKey){
        return {success: false, databaseName : null}
    }
    if(!devicesList.includes(deviceId) || apisKey[deviceId] != apiKey){
        return {success: false, databaseName : null}
    }
    const databaseName = databases[deviceId];
    return {success: true, databaseName : databaseName}
}
module.exports = validateDevice;