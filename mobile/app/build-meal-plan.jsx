import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { useUser } from "@clerk/clerk-expo";
import * as mealAPI from "../services/mealAPI";
import * as groceriesAPI from "../services/groceriesAPI";
import { useMealPlanStore } from "../store/useMealPlanStore";

const BuildMealPlanScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { addMeal, plannedMeals } = useMealPlanStore();
  
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDynamicRecipes();
  }, []);

  const loadDynamicRecipes = async () => {
    setLoading(true);
    try {
      const [popular, recent, recommended] = await Promise.all([
        mealAPI.fetchRecipesByCategory("Chicken"),
        mealAPI.fetchRecipesByCategory("Beef"),
        mealAPI.fetchRecipesByCategory("Seafood"),
      ]);

      // Normalize data: Rename idMeal to id and strMeal to title, strMealThumb to image for UI consistency
      const normalize = (list) => list.map(m => ({
        id: parseInt(m.idMeal),
        title: m.strMeal,
        image: m.strMealThumb,
        time: "30 min", // Fallback time
      }));

      setPopularRecipes(normalize(popular).slice(0, 6));
      setRecentRecipes(normalize(recent).slice(0, 6));
      setRecommendedRecipes(normalize(recommended).slice(0, 6));
    } catch (error) {
      console.error("Failed to load recipes for builder");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlan = async (recipe) => {
    // 1. Instantly Update Local Store UI
    addMeal(recipe);

    if (!user) return;
    try {
      // 2. Persist Meal Plan to Backend DB
      await mealAPI.saveMealPlan(user.id, recipe.id, recipe.title, recipe.image);

      // 3. Auto-Fetch Real Ingredients from TheMealDB using the valid ID
      const fullDetails = await mealAPI.fetchRecipeDetails(recipe.id);
      
      if (fullDetails) {
        const generatedGroceries = [];
        for (let i = 1; i <= 20; i++) {
          if (fullDetails[`strIngredient${i}`] && fullDetails[`strIngredient${i}`].trim() !== "") {
            generatedGroceries.push({
              ingredient: fullDetails[`strIngredient${i}`],
              measure: fullDetails[`strMeasure${i}`] || "",
            });
          }
        }
        
        // 4. Magic-Add all ingredients directly to the Groceries Database Cart!
        if (generatedGroceries.length > 0) {
          await groceriesAPI.autoAddGroceries(user.id, recipe.id, generatedGroceries);
        }
      }
    } catch (error) {
      console.error("Failed to sequence save operations", error);
    }
  };

  const renderRecipeCard = ({ item }) => {
    const isAdded = plannedMeals.some(m => m.id === item.id);
    return (
      <View style={styles.cardContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.recipeImage} />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddToPlan(item)}
            activeOpacity={0.7}
            disabled={isAdded}
          >
            <Ionicons name={isAdded ? "checkmark" : "add"} size={20} color={isAdded ? COLORS.primary : COLORS.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    );
  };

  const renderHorizontalSection = (title, data) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Build a meal plan</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {renderHorizontalSection("Most Popular (Chicken)", popularRecipes)}
            {renderHorizontalSection("Recent Favorites (Beef)", recentRecipes)}
            {renderHorizontalSection("Recommended (Seafood)", recommendedRecipes)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: COLORS.text,
  },
  seeAllText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: 140,
    marginHorizontal: 4,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: COLORS.border, // placeholder color
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default BuildMealPlanScreen;
