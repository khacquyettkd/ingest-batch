import type { Request, Response } from "express";
// import type {Condition,Value} from '../schemas/solar/solar.payloadData';
// const { TableInsertSchemas, TableUpdateSchemas } = require( "../schemas/solar/index.tableSchema");
// const { SolarInsertSchema, SolarUpdateSchema } = require( "../schemas/solar/solar.payloadData");
const { TableUpsertSchemas } = require("../schemas/solar/index.tableSchema");
const { SolarUpsertSchema } = require( "../schemas/solar/solar.payloadData");
const validateDevice = require( "../utils/validateDevice.util");
const pushToStream = require( "../services/producer.service");
// const { ZodIssue } = require( "zod");


// exports.solarInsert = async (req: Request, res:Response) => {
//   try {
//     const payload = SolarInsertSchema.safeParse(req.body);
//     if (!payload.success) {
//       return res.status(400).json({ success: false, message: "Invalid payload" });
//     }
//     const { deviceId, apiKey, brand, table, data } = payload.data;
//     const valid = validateDevice(deviceId,apiKey);
//     if(!valid.success){
//       return res.status(401).json({ 
//         success: false, 
//         message: `Unauthenticated device` 
//       });
//     }
//     const databaseName = valid.databaseName;
//     let schema;
//     if (table === "inverter") {
//       if(brand === 'sungrow'){
//         schema = TableInsertSchemas.inverter.sungrow;
//       }else{
//         schema = TableInsertSchemas.inverter.others;
//       }
//     }else{
//       schema = TableInsertSchemas[table];
//     }

//     if (!schema) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Unsupported table: ${table}` 
//       });
//     }
//     const validRows = [];
//     for (const row of data) {
//       const parsed = schema.safeParse(row);
//       if (!parsed.success) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid data format in row",
//           error: parsed.error.format()
//         });
//       }
//       validRows.push(parsed.data);
//     }
//     const event = [
//       "t", 'insert',
//       "db", databaseName,
//       "tb", table,
//       "b", brand,
//       "d", JSON.stringify(validRows)
//     ]
//     await pushToStream(event);
//     return res.status(200).json({ 
//       success: true,
//       message: "Queued"
//     });
//   } catch (e) {
//     if(process.env.NODE_ENV !== 'production'){
//       console.error(e);
//     }
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// }
// exports.solarUpdate= async (req: Request, res:Response) => {
//   try {
//     const payload = SolarUpdateSchema.safeParse(req.body);
//     if (!payload.success) {
//       return res.status(400).json({ success: false, message: "Invalid payload" });
//     }
//     const { deviceId, apiKey, brand, table, data } = payload.data;
//     const valid = validateDevice(deviceId,apiKey);
//     if(!valid.success){
//       return res.status(401).json({ 
//         success: false, 
//         message: `Unauthenticated device` 
//       });
//     }
//     const databaseName = valid.databaseName;
//     const schema = TableUpdateSchemas[table];
//     if (!schema) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Unsupported table: ${table}` 
//       });
//     }
//     const validFields = Object.keys(schema.shape);
//     const invalidConditions: any[] = [];
//     const invalidValues: any[] = [];

//     for (const item of data) {
//       const { condition, update } = item;

//       const badConditions = condition.filter((c: Condition) => !validFields.includes(c.field));
//       if (badConditions.length > 0) invalidConditions.push(...badConditions);

//       const badValues = update.filter((v: Value) => !validFields.includes(v.field));
//       if (badValues.length > 0) invalidValues.push(...badValues);
//     }

//     if (invalidConditions.length > 0 || invalidValues.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid field in condition/value",
//         errors: {
//           condition: invalidConditions,
//           value: invalidValues
//         }
//       });
//     }

//     const event = [
//       "t",'update',
//       "db",databaseName,
//       "tb",table, 
//       "b",brand, 
//       "d", JSON.stringify(data)
//     ]
//     await pushToStream(event);
//     return res.status(200).json({ 
//       success: true,
//       message: "Queued"
//     });
//   } catch (e) {
//     if(process.env.NODE_ENV !== 'production'){
//       console.error(e);
//     }
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// }
exports.solarUpsert = async (req: Request, res:Response) => {
  try {
    const payload = SolarUpsertSchema.safeParse(req.body);
    if (!payload.success) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payload",
        error: payload.error.format()
      });
    }
    const { deviceId, apiKey, brand, table, data } = payload.data;
    const valid = validateDevice(deviceId,apiKey);
    if(!valid.success){
      return res.status(401).json({ 
        success: false, 
        message: `Unauthenticated device` 
      });
    }
    const databaseName = valid.databaseName;
    let schema;
    if (table === "inverter") {
      if(brand === 'sungrow'){
        schema = TableUpsertSchemas.inverter.sungrow;
      }else{
        schema = TableUpsertSchemas.inverter.others;
      }
    }else{
      schema = TableUpsertSchemas[table];
    }

    if (!schema) {
      return res.status(400).json({ 
        success: false, 
        message: `Unsupported table: ${table}` 
      });
    }
    const validRows = [];
    for (const row of data) {
      const parsed = schema.safeParse(row);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format in row",
          error: parsed.error.format()
        });
      }
      validRows.push(parsed.data);
    }
    const event = [
      "db", databaseName,
      "tb", table,
      "b", brand,
      "d", JSON.stringify(validRows)
    ]
    await pushToStream(event);
    return res.status(200).json({ 
      success: true,
      message: "Queued"
    });
  } catch (e) {
    if(process.env.NODE_ENV !== 'production'){
      console.error(e);
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}