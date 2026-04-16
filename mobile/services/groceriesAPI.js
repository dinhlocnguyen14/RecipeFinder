import axios from "axios";

// Using the same URL logic as before. EXPO_PUBLIC_BACKEND_URL currently has `/favorites` appended in local env, so we strip it.
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? process.env.EXPO_PUBLIC_BACKEND_URL.replace("/favorites", "") : "http://localhost:5001/api";

export const getGroceries = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/groceries/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching groceries:", error);
    return [];
  }
};

export const autoAddGroceries = async (userId, recipeId, ingredients) => {
  try {
    const response = await axios.post(`${API_URL}/groceries/bulk`, {
      userId,
      recipeId,
      items: ingredients,
    });
    return response.data;
  } catch (error) {
    console.error("Error auto-adding groceries:", error);
    throw error;
  }
};

export const toggleGroceryItem = async (itemId, isChecked) => {
  try {
    const response = await axios.put(`${API_URL}/groceries/${itemId}/toggle`, {
      isChecked,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling grocery:", error);
    throw error;
  }
};

export const deleteGroceryItem = async (itemId) => {
  try {
    await axios.delete(`${API_URL}/groceries/${itemId}`);
    return true;
  } catch (error) {
    console.error("Error deleting grocery:", error);
    return false;
  }
};
