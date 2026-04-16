import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchRecipesByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
    return response.data.meals;
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    return [];
  }
};

export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals[0];
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
};

export const searchRecipes = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);
    return response.data.meals;
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
};

const LOCAL_API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? process.env.EXPO_PUBLIC_BACKEND_URL.replace("/favorites", "") : "http://localhost:5001/api";

export const saveMealPlan = async (userId, recipeId, title, image) => {
  try {
    const response = await axios.post(`${LOCAL_API_URL}/meal-plans`, { userId, recipeId, title, image });
    return response.data;
  } catch (error) {
    console.error("Error saving meal plan:", error);
    throw error;
  }
};

export const getMealPlans = async (userId) => {
  try {
    const response = await axios.get(`${LOCAL_API_URL}/meal-plans/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return [];
  }
};

export const deleteMealPlan = async (userId, recipeId) => {
  try {
    await axios.delete(`${LOCAL_API_URL}/meal-plans/${userId}/${recipeId}`);
    return true;
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    return false;
  }
};
