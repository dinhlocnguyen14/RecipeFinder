import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? process.env.EXPO_PUBLIC_BACKEND_URL.replace("/favorites", "") : "http://localhost:5001/api";

export const getCollections = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/collections/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const createCollection = async (userId, name, image) => {
  try {
    const response = await axios.post(`${API_URL}/collections`, { userId, name, image });
    return response.data;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const addRecipeToCollection = async (collectionId, recipeId, title, image) => {
  try {
    const response = await axios.post(`${API_URL}/collections/recipes`, { collectionId, recipeId, title, image });
    return response.data;
  } catch (error) {
    console.error("Error adding to collection:", error);
    throw error;
  }
};

export const removeRecipeFromCollection = async (collectionId, recipeId) => {
  try {
    await axios.delete(`${API_URL}/collections/${collectionId}/recipes/${recipeId}`);
    return true;
  } catch (error) {
    console.error("Error removing from collection:", error);
    return false;
  }
};
