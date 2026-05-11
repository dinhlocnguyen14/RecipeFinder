import { createContext, useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  Slot,
  useLocalSearchParams,
  useRouter,
  usePathname,
} from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../../constants/api";
import { MealAPI } from "../../../services/mealAPI";
import { UserRecipeAPI } from "../../../services/userRecipeAPI";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { recipeDetailStyles } from "../../../assets/styles/recipe-detail.styles";
import { useToast } from "../../../hooks/useToast";

const RecipeContext = createContext();

export const useRecipe = () => useContext(RecipeContext);

export default function RecipeLayout() {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast, ToastComponent } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!recipeId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Check if saved
        if (userId) {
          try {
            const favRes = await fetch(`${API_URL}/favorites/${userId}`);
            if (favRes.ok) {
              const favorites = await favRes.json();
              if (Array.isArray(favorites)) {
                setIsSaved(
                  favorites.some((fav) => fav.recipeId === parseInt(recipeId)),
                );
              }
            }
          } catch (favError) {
            console.error("Error checking favorites:", favError);
          }
        }

        // Load detail
        if (recipeId.toString().startsWith("user_")) {
          const originalId = recipeId.toString().replace("user_", "");
          const userData = await UserRecipeAPI.getRecipeById(originalId);
          if (userData) {
            setRecipe(userData);
          }
        } else {
          const mealData = await MealAPI.getMealById(recipeId);
          if (mealData) {
            const transformed = MealAPI.transformMealData(mealData);
            setRecipe({
              ...transformed,
              youtubeUrl: mealData.strYoutube || null,
            });
          }
        }
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [recipeId, userId]);

  const handleToggleSave = async () => {
    if (!userId || !recipe) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        const res = await fetch(`${API_URL}/favorites/${userId}/${recipeId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsSaved(false);
          showToast("Removed from your favorites 💔", "info");
        }
      } else {
        const res = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            recipeId: parseInt(recipeId),
            title: recipe.title,
            image: recipe.image,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
          }),
        });
        if (res.ok) {
          setIsSaved(true);
          showToast("Added to your favorites! ❤️", "success");
        }
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      showToast("Oops! Couldn't update your favorites 🍳", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading recipe..." />;
  if (!recipe)
    return (
      <View style={recipeDetailStyles.container}>
        <Text>Recipe not found</Text>
      </View>
    );

  const currentTab = pathname.split("/").pop(); // "", "ingredients", or "instructions"

  const tabs = [
    { id: "overview", label: "Overview", path: `/recipe/${recipeId}` },
    {
      id: "ingredients",
      label: "Ingredients",
      path: `/recipe/${recipeId}/ingredients`,
    },
    {
      id: "instructions",
      label: "Steps",
      path: `/recipe/${recipeId}/instructions`,
    },
  ];

  return (
    <RecipeContext.Provider
      value={{ recipe, isSaved, isSaving, handleToggleSave }}
    >
      <View style={recipeDetailStyles.container}>
        {ToastComponent}
        <ScrollView
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
        >
          {/* 0: HEADER */}
          <View style={recipeDetailStyles.headerContainer}>
            <View style={recipeDetailStyles.imageContainer}>
              <Image
                source={{ uri: recipe.image }}
                style={recipeDetailStyles.headerImage}
                contentFit="cover"
              />
            </View>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
              style={recipeDetailStyles.gradientOverlay}
            />

            <View style={recipeDetailStyles.floatingButtons}>
              <TouchableOpacity
                style={recipeDetailStyles.floatingButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  recipeDetailStyles.floatingButton,
                  { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
                ]}
                onPress={handleToggleSave}
                disabled={isSaving}
              >
                <Ionicons
                  name={
                    isSaving
                      ? "hourglass"
                      : isSaved
                        ? "bookmark"
                        : "bookmark-outline"
                  }
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            <View style={recipeDetailStyles.titleSection}>
              <View style={recipeDetailStyles.categoryBadge}>
                <Text style={recipeDetailStyles.categoryText}>
                  {recipe.category}
                </Text>
              </View>
              <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            </View>
          </View>

          {/* 1: STICKY TAB BAR */}
          <View style={recipeDetailStyles.contentSection}>
            <View style={recipeDetailStyles.tabBar}>
              {tabs.map((tab) => {
                const isActive =
                  (tab.id === "overview" &&
                    (currentTab === recipeId || currentTab === "overview")) ||
                  currentTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      recipeDetailStyles.tabItem,
                      isActive && recipeDetailStyles.activeTabItem,
                    ]}
                    onPress={() => router.replace(tab.path)}
                  >
                    <Text
                      style={[
                        recipeDetailStyles.tabLabel,
                        isActive && recipeDetailStyles.activeTabLabel,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 2: SUB-SCREEN CONTENT */}
          <View style={{ backgroundColor: COLORS.background }}>
            <Slot />
            {/* Khoảng trống ở cuối để tránh bị che */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>
      </View>
    </RecipeContext.Provider>
  );
}
