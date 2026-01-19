import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config({path: "./.env", override: true})

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

const pool = new Pool({
  user: db_user,
  password: db_password,
  host: "localhost",
  port: 5432,
  database: 'constructortests'
})
export default pool;