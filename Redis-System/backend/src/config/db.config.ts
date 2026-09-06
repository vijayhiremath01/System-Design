import pg from 'pg';
import { env } from './env.js';

const { Pool } : any = pg;


export const db = new Pool({
    connectionString : env.databaseUrl 
})

db.on("error" , (error : any) => {
    console.error("PostgreSQL Client Error", error);
})

export const connectDB = async () => {
    try {
        const client = await db.connect();
        console.log("Connected to PostgreSQL");

        client.release();
    } catch(error) {
        console.error("Error connecting to PostgreSQL", error);
        throw error;
    }
}

