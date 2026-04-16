/**
 * Utility to generate realistic but deterministic stats for recipes
 * based on their ID. This ensures the same recipe always has the
 * same stats without them being hardcoded in every component.
 */

export const getRecipeStats = (recipeId) => {
  const idStr = recipeId.toString();
  const idSum = idStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Cooking Time (20 - 60 mins)
  const time = 20 + (idSum % 41);
  
  // Rating (4.0 - 5.0)
  const rating = (4.0 + (idSum % 11) / 10).toFixed(1);
  
  // Calories (250 - 600)
  const calories = 250 + (idSum % 351);
  
  // Servings (1 - 4)
  const servings = 1 + (idSum % 4);

  return {
    time,
    rating,
    calories,
    servings
  };
};
