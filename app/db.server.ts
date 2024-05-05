import pg, { type PoolClient } from "pg";

if (typeof process.env.PGHOST !== "string") {
  throw new Error("Missing env: PGHOST");
}

if (typeof process.env.PGUSER !== "string") {
  throw new Error("Missing env: PGUSER");
}

if (typeof process.env.PGPASSWORD !== "string") {
  throw new Error("Missing env: PGPASSWORD");
}

if (typeof process.env.PGPORT !== "string") {
  throw new Error("Missing env: PGPORT");
}

if (typeof process.env.PGDATABASE !== "string") {
  throw new Error("Missing env: PGDATABASE");
}

if (typeof process.env.DB_DEBUG_FLAG !== "string") {
  throw new Error("Missing env: DB_DEBUG_FLAG");
}

const config = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  //port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
};

const debugDatabase = Number(process.env.DB_DEBUG_FLAG);

interface CustomNodeJSGlobal extends NodeJS.Global {
  dbPool: pg.Pool;
}

declare const global: CustomNodeJSGlobal;

const dbPool = global.dbPool || new pg.Pool(config);

if (process.env.NODE_ENV === "development") {
  global.dbPool = dbPool;
}

export const getDbClient = (tx?: PoolClient): Promise<PoolClient> => {
  if (tx) {
    return tx as unknown as Promise<PoolClient>;
  }
  return dbPool.connect();
};

export const dbQueryRow = async <T = any>(
  sql: string,
  values: any[] | null,
  tx?: PoolClient
): Promise<T> => {
  let client = await getDbClient(tx);
  let start = Date.now();

  if (Array.isArray(values)) {
    try {
      if (debugDatabase) {
        console.log("executed query", { sql });
      }
      let res = await client.query(sql, values);
      if (debugDatabase) {
        let duration = Date.now() - start;
        console.log("result data", { duration, rows: res.rowCount });
      }

      //return (res.command === "DELETE" ? res.rowCount !== 0 : res.rows[0]) as T;
      return res.rows[0] as T;
    } catch (e) {
      throw e;
    } finally {
      if (!tx) client.release();
    }
  }

  try {
    if (debugDatabase) {
      console.log("executed query", { sql });
    }
    let res = await client.query(sql);
    if (debugDatabase) {
      let duration = Date.now() - start;
      console.log("result data", { duration, rows: res.rowCount });
    }

    return res.rows[0] as T;
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    if (!tx) client.release();
  }
};

export const dbQuery = async <T = any>(
  sql: string,
  values: any[] | null,

  tx?: PoolClient
) => {
  let client = await getDbClient(tx);
  let start = Date.now();

  if (Array.isArray(values)) {
    try {
      if (debugDatabase) {
        console.log("executed query", { sql });
      }
      let res = await client.query(sql, values);
      if (debugDatabase) {
        let duration = Date.now() - start;
        console.log("result data", { duration, rows: res.rowCount });
      }

      return res.rows as T[];
    } catch (e) {
      throw e;
    } finally {
      if (!tx) client.release();
    }
  } else {
    try {
      if (debugDatabase) {
        console.log("executed query", { sql });
      }
      let res = await client.query(sql);
      if (debugDatabase) {
        let duration = Date.now() - start;
        console.log("result data", { duration, rows: res.rowCount });
      }

      return res.rows as T[];
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      if (!tx) client.release();
    }
  }
};
