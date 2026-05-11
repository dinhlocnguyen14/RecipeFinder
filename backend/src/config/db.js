import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { ENV } from "./env.js";
import * as schema from "../db/schema.js";

class MockQueryBuilder {
  insert() {
    return this;
  }
  values(data) {
    this.data = data;
    return this;
  }
  returning() {
    return Promise.resolve([this.data || { recipeId: 101, title: "Phở Gà" }]);
  }
  select() {
    return this;
  }
  from() {
    return this;
  }
  where() {
    return this;
  }
  orderBy() {
    return Promise.resolve([{ id: 1, title: "Mock Recipe" }]);
  }
  delete() {
    return this;
  }
}

let database;
if (process.env.NODE_ENV === "test") {
  database = new MockQueryBuilder();
} else {
  const sql = neon(ENV.DATABASE_URL);
  database = drizzle(sql, { schema });
}

export const db = database;
