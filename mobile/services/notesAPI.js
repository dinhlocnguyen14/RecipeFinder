import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL ? process.env.EXPO_PUBLIC_BACKEND_URL.replace("/favorites", "") : "http://localhost:5001/api";

export const getNotes = async (userId, recipeId) => {
  try {
    const response = await axios.get(`${API_URL}/notes/${userId}/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const saveNote = async (userId, recipeId, content) => {
  try {
    const response = await axios.post(`${API_URL}/notes`, {
      userId,
      recipeId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving note:", error);
    throw error;
  }
};
