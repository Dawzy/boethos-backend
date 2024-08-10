import pg from "pg";
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432
});

export const query = (text, params) => pool.query(text, params);

// Single client for transactions
export const getClient = () => pool.connect();