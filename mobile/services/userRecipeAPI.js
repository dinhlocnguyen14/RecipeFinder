import { API_URL } from "../constants/api";

export const UserRecipeAPI = {
  saveRecipe: async (recipeData) => {
    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save recipe');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving user recipe:", error);
      throw error;
    }
  },
};
