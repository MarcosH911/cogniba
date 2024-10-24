import { type Column, sql } from "drizzle-orm";

export function date(column: Column) {
  return sql<string>`DATE(${column})`;
}
