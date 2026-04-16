import { create } from "zustand";

export const useMealPlanStore = create((set) => ({
  plannedMeals: [],
  
  addMeal: (meal) => 
    set((state) => {
      // Avoid duplicate adds
      if (state.plannedMeals.find(m => m.id === meal.id)) {
        return state;
      }
      return { plannedMeals: [...state.plannedMeals, meal] };
    }),

  removeMeal: (mealId) =>
    set((state) => ({
      plannedMeals: state.plannedMeals.filter((m) => m.id !== mealId),
    })),
    
  clearPlan: () => set({ plannedMeals: [] }),
}));
