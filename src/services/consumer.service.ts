const getPool = require('../mysql/dbPool');
const getRedisConnection = require( '../redis/redisClient');
const { TableInsertColumns } = require( '../schemas/solar/index.tableSchema');
import type { PoolConnection } from "mysql2/promise";
const logger = require( '../utils/logger.util');

const redis = getRedisConnection();

type GroupedEvents = {
  [database: string]: {
    brand : string,
    data : {
      [table: string]: {
        insert: any[];
        update: { condition: any; value: any }[];
      };
    }
  };
};
const groupEvent = async(entries:[id: string, fields: string[]][])=>{
  let grouped:GroupedEvents={};
  for (const [id, fields] of entries) {
    const type = fields[1] as string;
    const database = fields[3] as string;
    const table = fields[5] as string;
    const brand = fields[7] as string;
    if(!grouped[database]){
      grouped[database] = { 
        brand: brand,
        data: {}
      };
    }
    if(!grouped[database]["data"][table]){
      grouped[database]["data"][table] = {
        insert: [], 
        update: []
      };
    }
    if(type =='insert'){
      const data = JSON.parse(fields[9]!);
      grouped[database]!["data"]![table]!['insert'].push(data);
    }else if(type == 'update'){
      const condition = JSON.parse(fields[9]!);
      const value = JSON.parse(fields[11]!);
      grouped[database]!["data"]![table]!['update'].push({
        "condition" : condition,
        "value" : value
      })
    }
    await redis.xdel("solar_stream", id);
  }
  return grouped;
}

async function consumer() {
  const entries = await redis.xrange("solar_stream", "-", "+");
  if (entries.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.log("No events in stream");
    }
    return;
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log(entries.length);
  }
  const grouped = await groupEvent(entries);

  //insert/update to database
  for (const [dbName, payload] of Object.entries(grouped)) {
    let connection: PoolConnection | null | undefined = null;
    try{
      const brand = payload.brand;
      const tables = payload.data;
      const pool = getPool(dbName);
      connection = await pool?.getConnection();
      for (const [tableName, operations] of Object.entries(tables)) {
        //insert
        try{
          const insertDatas = operations.insert;
          if(insertDatas.length > 0){
            const columnsArr:string[] = 
              tableName=='inverter'
              ?(
                brand == 'sungrow'
                ?TableInsertColumns.inverter.sungrow
                :TableInsertColumns.inverter.others
              )
              :TableInsertColumns[tableName];
            if(columnsArr){
              const columns = columnsArr.join(', ');
              const values = insertDatas.map(row => {
                const vals = columnsArr.map(col => `'${row[col]}'`);
                return `(${vals.join(", ")})`;
              }).join(", ");
              const sql = `
                INSERT INTO ${tableName}
                  (${columns})
                VALUES
                  ${values}
              `
              connection?.query(sql).catch(e => {
                if (process.env.NODE_ENV !== 'production') {
                  console.log(e);
                }
                logger.error(e);
              });
              // try {
              //   await connection?.query(sql);
              // } catch (err) {
              //   console.error("Query error:", err);
              // }
            }
          }
        }catch(e){
          if (process.env.NODE_ENV !== 'production') {
            console.log(e);
          }
          logger.error(`[Insert failed] ${e}`)
        }
        //update
        try{
          const updateDatas = operations.update;
          if(updateDatas.length > 0){
            for (const row of updateDatas) {
              const conditionsArr = row.condition.map((cond: { field: string; operator: string; value: any; })=>{
                return `${cond.field}${cond.operator}'${cond.value}'`
              });
              const conditions = conditionsArr.join(' AND ');
              const valuesArr = row.value.map((val: { field: string; value: any; })=>{
                return `${val.field}='${val.value}'`
              })
              const values = valuesArr.join(', ');
              const sql = `
                UPDATE ${tableName} SET ${values} WHERE ${conditions}
              `
              // writeLog(sql);
              connection?.query(sql).catch(e => {
                if (process.env.NODE_ENV !== 'production') {
                  console.log(e);
                }
                logger.error(e);
              });
              // try {
              //   await connection?.query(sql);
              // } catch (err) {
              //   console.error("Query error:", err);
              // }
            }
          }
        }catch(e){
          if (process.env.NODE_ENV !== 'production') {
            console.log(e);
          }
          logger.error(`[Update failed] ${e}`)
        }
      }
    }catch(e){
      if (process.env.NODE_ENV !== 'production') {
        console.log(e);
        logger.error(`[Consumer failed] ${e}`)
      }
    }finally{
      if(connection){
        connection.release();
      }
    }
  }
}
module.exports = consumer;
