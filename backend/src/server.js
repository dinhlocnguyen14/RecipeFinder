import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import {
  favoritesTable,
  userRecipesTable,
  feedbackTable,
} from "./db/schema.js";
import { and, eq, desc, or, ilike } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") job.start();

app.use(cors());
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
      .where(eq(favoritesTable.userId, userId))
      .orderBy(desc(favoritesTable.createdAt));
    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error to get favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// USER RECIPES ROUTES
app.post("/api/user-recipes", async (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      ingredients,
      instructions,
      image,
      cookTime,
      servings,
      youtubeUrl,
    } = req.body;

    if (!userId || !title || !ingredients || !instructions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRecipe = await db
      .insert(userRecipesTable)
      .values({
        userId,
        title,
        category,
        ingredients,
        instructions,
        image,
        cookTime,
        servings,
        youtubeUrl,
      })
      .returning();

    res.status(201).json(newRecipe[0]);
  } catch (error) {
    console.log("Error creating user recipe", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/user-recipes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const recipes = await db
      .select()
      .from(userRecipesTable)
      .where(eq(userRecipesTable.userId, userId))
      .orderBy(desc(userRecipesTable.createdAt));
    res.status(200).json(recipes);
  } catch (error) {
    console.log("Error fetching user recipes", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/user-recipes/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await db
      .select()
      .from(userRecipesTable)
      .where(eq(userRecipesTable.id, parseInt(id)));

    if (recipe.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe[0]);
  } catch (error) {
    console.log("Error fetching recipe detail", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/user-recipes/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const recipes = await db
      .select()
      .from(userRecipesTable)
      .where(
        or(
          ilike(userRecipesTable.title, `%${q}%`),
          ilike(userRecipesTable.category, `%${q}%`),
          ilike(userRecipesTable.ingredients, `%${q}%`),
        ),
      );
    res.status(200).json(recipes);
  } catch (error) {
    console.log("Error searching user recipes", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// FEEDBACK ROUTE
app.post("/api/feedback", async (req, res) => {
  try {
    const { userId, email, subject, message } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: "Subject and message are required" });
    }

    const newFeedback = await db
      .insert(feedbackTable)
      .values({
        userId,
        email,
        subject,
        message,
      })
      .returning();

    res.status(201).json(newFeedback[0]);
  } catch (error) {
    console.log("Error submitting feedback", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// DUMMY AUTH ROUTE FOR POSTMAN TESTING
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (email === "user.test@example.com" && password === "Password123!") {
    return res.status(200).json({
      status: "success",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_for_testing",
      user: { id: "user_123", email },
    });
  }

  return res.status(401).json({ error: "Invalid email or password" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
}
export default app;
