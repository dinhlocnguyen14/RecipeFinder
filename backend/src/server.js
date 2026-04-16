import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable, notesTable, groceriesTable, mealPlanTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();
    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: " Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId)),
        ),
      );
    res.status(200).json({ message: "Favorites removed successfully" });
  } catch (error) {
    console.log("Error removing a favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error to get favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================= NOTES API =================
app.get("/api/notes/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const notes = await db
      .select()
      .from(notesTable)
      .where(and(eq(notesTable.userId, userId), eq(notesTable.recipeId, parseInt(recipeId))));
    res.status(200).json(notes);
  } catch (error) {
    console.log("Error getting notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { userId, recipeId, content } = req.body;
    if (!userId || !recipeId || !content) return res.status(400).json({ error: "Missing fields" });

    // Check if a note already exists for this user+recipe to update rather than add duplicate
    const existing = await db
      .select()
      .from(notesTable)
      .where(and(eq(notesTable.userId, userId), eq(notesTable.recipeId, parseInt(recipeId))));

    if (existing.length > 0) {
      const updated = await db
        .update(notesTable)
        .set({ content, createdAt: new Date() })
        .where(eq(notesTable.id, existing[0].id))
        .returning();
      return res.status(200).json(updated[0]);
    }

    const newNote = await db
      .insert(notesTable)
      .values({ userId, recipeId, content })
      .returning();
    res.status(201).json(newNote[0]);
  } catch (error) {
    console.log("Error saving note:", error);
    res.status(500).json({ error: "Failed to save note" });
  }
});

// ================= MEAL PLAN API =================
app.get("/api/meal-plans/:userId", async (req, res) => {
  try {
    const plans = await db
      .select()
      .from(mealPlanTable)
      .where(eq(mealPlanTable.userId, req.params.userId));
    res.status(200).json(plans);
  } catch (error) {
    console.log("Error fetching meal plans", error);
    res.status(500).json({ error: "Failed to fetch meal plans" });
  }
});

app.post("/api/meal-plans", async (req, res) => {
  try {
    const { userId, recipeId, title, image } = req.body;
    if (!userId || !recipeId) return res.status(400).json({ error: "Missing fields" });

    const newPlan = await db
      .insert(mealPlanTable)
      .values({ userId, recipeId, title, image })
      .returning();
    res.status(201).json(newPlan[0]);
  } catch (error) {
    console.log("Error saving meal plan:", error);
    res.status(500).json({ error: "Failed to build meal plan" });
  }
});

app.delete("/api/meal-plans/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    await db
      .delete(mealPlanTable)
      .where(and(eq(mealPlanTable.userId, userId), eq(mealPlanTable.recipeId, parseInt(recipeId))));
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ================= GROCERIES API =================
app.get("/api/groceries/:userId", async (req, res) => {
  try {
    const list = await db
      .select()
      .from(groceriesTable)
      .where(eq(groceriesTable.userId, req.params.userId));
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groceries" });
  }
});

app.post("/api/groceries/bulk", async (req, res) => {
  try {
    const { userId, recipeId, items } = req.body; 
    // items is [{ ingredient, measure }]
    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const records = items.map(i => ({
      userId,
      recipeId,
      ingredient: i.ingredient,
      measure: i.measure,
      isChecked: false,
    }));

    const result = await db.insert(groceriesTable).values(records).returning();
    res.status(201).json(result);
  } catch (error) {
    console.log("Error bulk inserting groceries", error);
    res.status(500).json({ error: "Failed to sync groceries" });
  }
});

app.put("/api/groceries/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const { isChecked } = req.body;
    
    const updated = await db
      .update(groceriesTable)
      .set({ isChecked })
      .where(eq(groceriesTable.id, parseInt(id)))
      .returning();
      
    res.status(200).json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

app.delete("/api/groceries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(groceriesTable).where(eq(groceriesTable.id, parseInt(id)));
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.listen(5001, () => {
  console.log("Server is running on PORT:", PORT);
});
