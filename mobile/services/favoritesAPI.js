import axios from "axios";

// Change this to your local IP if testing on a physical device
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:5001/api/favorites";

export const getFavorites = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const addFavorite = async (favoriteData) => {
  try {
    const response = await axios.post(API_URL, favoriteData);
    return response.data;
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (userId, recipeId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/${recipeId}`);
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
};
