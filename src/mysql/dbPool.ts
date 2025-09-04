const dotenv = require( 'dotenv');
const path = require( 'path');
const mysql = require( 'mysql2/promise');
import type { Pool } from "mysql2/promise";
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface PoolEntry {
  pool: Pool;
  timeoutId: NodeJS.Timeout;
}
const pools: Map<string, PoolEntry> = new Map(); // {dbName,{pool,timoutId}}

function getPool(dbName:string):Pool|null {
    try{
        if (pools.has(dbName)) {
            const entry = pools.get(dbName);
            if (entry && entry.pool && typeof entry.pool.execute === 'function'){
                clearTimeout(entry.timeoutId); 
                entry.timeoutId = setTimeout(() => {
                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`Closing pool for ${dbName} due to inactivity.`);
                    }
                    pools.delete(dbName);
                    entry.pool.end();    
                }, 2 * 60 * 1000); 
                return entry.pool;
            }else{
                pools.delete(dbName);
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Creating pool for ${dbName}`)
        }
        const pool = mysql.createPool({
            host: process.env.DB_HOST!,
            user: process.env.DB_USER!,  
            password: process.env.DB_PASSWORD!, 
            waitForConnections: true,
            database: dbName,
            connectionLimit: 10,
            queueLimit: 0,
            // acquireTimeout: 60000,
            // timeout: 60000,
            // reconnect: true,
            
        });
        const timeoutId = setTimeout(() => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Closing pool for ${dbName} due to inactivity.`);
            }
            pool.end();
            pools.delete(dbName);
        }, 5 * 60 * 1000);
        pools.set(dbName, { pool, timeoutId });
        return pool;
    }catch(e){
        if (process.env.NODE_ENV !== 'production') {
            console.log(e);
        };
        return null;
    }
}
function closeAllPools():void {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Closing all MySQL pools...');
    }
    for (const [dbName, entry] of pools) {
        clearTimeout(entry.timeoutId);
        entry.pool.end();
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Closed pool for ${dbName}`);
        }
    }
    pools.clear();
}
process.on('SIGINT', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Received SIGINT, shutting down gracefully...');
    }
    closeAllPools();
    process.exit(0);
});

process.on('SIGTERM', () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Received SIGTERM, shutting down gracefully...');
    }
    closeAllPools();
    process.exit(0);
});
module.exports=getPool;