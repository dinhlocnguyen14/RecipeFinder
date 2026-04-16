import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notesTable = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groceriesTable = pgTable("groceries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id"),
  ingredient: text("ingredient").notNull(),
  measure: text("measure"),
  isChecked: boolean("is_checked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlanTable = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});
