import { API_URL } from "../constants/api";

export const UserRecipeAPI = {
  // Get all recipes created by a user
  getUserRecipes: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/user-recipes/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user recipes");
      const data = await response.json();
      return data.map((recipe) => ({
        ...recipe,
        isUserCreated: true, // Mark as user-created to differentiate
        id: `user_${recipe.id}`, // Ensure unique ID for lists
        originalId: recipe.id,
      }));
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return [];
    }
  },

  // Get single recipe detail
  getRecipeById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/user-recipes/detail/${id}`);
      if (!response.ok) throw new Error("Recipe not found");
      const data = await response.json();

      // Transform to match app format
      return {
        ...data,
        isUserCreated: true,
        ingredients: data.ingredients.split("\n").filter((i) => i.trim()),
        instructions: data.instructions.split("\n").filter((i) => i.trim()),
      };
    } catch (error) {
      console.error("Error fetching recipe detail:", error);
      return null;
    }
  },

  // Search recipes
  searchRecipes: async (query) => {
    try {
      const response = await fetch(
        `${API_URL}/user-recipes/search?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      return data.map((recipe) => ({
        ...recipe,
        isUserCreated: true,
        id: `user_${recipe.id}`,
        originalId: recipe.id,
      }));
    } catch (error) {
      console.error("Error searching user recipes:", error);
      return [];
    }
  },

  // Save a new recipe
  saveRecipe: async (recipeData) => {
    try {
      const response = await fetch(`${API_URL}/user-recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save recipe");
      }
      return await response.json();
    } catch (error) {
      console.error("Error saving user recipe:", error);
      throw error;
    }
  },
};
