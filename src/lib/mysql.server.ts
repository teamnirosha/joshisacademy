// ============================================================================
// MySQL Database Client Service for Joshi's Academy CMS
// Replaces Supabase Database calls with standard MySQL Database query execution
// ============================================================================

export type MySQLConfig = {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
};

export function getMySQLConfig(): MySQLConfig | null {
  if (typeof window !== "undefined") return null;

  const host = process.env["MYSQL_HOST"] || import.meta.env["VITE_MYSQL_HOST"];
  const database = process.env["MYSQL_DATABASE"] || import.meta.env["VITE_MYSQL_DATABASE"];
  const user = process.env["MYSQL_USER"] || import.meta.env["VITE_MYSQL_USER"];

  if (!host || !database || !user) {
    return null;
  }

  const portStr = process.env["MYSQL_PORT"] || import.meta.env["VITE_MYSQL_PORT"] || "3306";
  const password = process.env["MYSQL_PASSWORD"] || import.meta.env["VITE_MYSQL_PASSWORD"] || "";

  return {
    host,
    port: parseInt(portStr, 10) || 3306,
    user,
    password,
    database,
  };
}

export function isMySQLConfigured(): boolean {
  return getMySQLConfig() !== null;
}

/**
 * Execute SQL Query against MySQL Database (Server-Side Only)
 * Returns array of rows or result object
 */
export async function queryMySQL<T = any[]>(sql: string, params: any[] = []): Promise<T | null> {
  if (typeof window !== "undefined") return null;

  const config = getMySQLConfig();
  if (!config) {
    return null;
  }

  try {
    // Dynamic runtime import to prevent Vite client bundler from static-evaluating mysql2
    const importMysql = new Function('return import("mysql2/promise")');
    const mysql = await importMysql();

    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: 5000,
    });

    const [rows] = await connection.execute(sql, params);
    await connection.end();
    return rows as T;
  } catch (err: any) {
    console.warn("[MySQL Database Notice]:", err?.message || err);
    return null;
  }
}
