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

// Mock Data with REAL TheMealDB integer IDs so we can fetch real ingredients dynamically!
const MOCK_RECIPES = [
  {
    id: 52772,
    title: "Teriyaki Chicken Casserole",
    image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    time: "35 min",
  },
  {
    id: 52874,
    title: "Beef and Mustard Pie",
    image: "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
    time: "40 min",
  },
  {
    id: 52836,
    title: "Seafood stew",
    image: "https://www.themealdb.com/images/media/meals/spswqs1511558697.jpg",
    time: "20 min",
  },
];

const MOCK_RECENT = [
  {
    id: 52928,
    title: "BeaverTails",
    image: "https://www.themealdb.com/images/media/meals/ryppsv1511815505.jpg",
    time: "50 min",
  },
  {
    id: 52893,
    title: "Apple & Blackberry Crumble",
    image: "https://www.themealdb.com/images/media/meals/xvsurr1511719182.jpg",
    time: "15 min",
  },
];

const MOCK_RECOMMENDED = [
  {
    id: 52878,
    title: "Beef and Oyster pie",
    image: "https://www.themealdb.com/images/media/meals/wrssjt1511556544.jpg",
    time: "25 min",
  },
  {
    id: 52784,
    title: "Smoky Lentil Chili",
    image: "https://www.themealdb.com/images/media/meals/uwxqwy1483389553.jpg",
    time: "30 min",
  },
];

const BuildMealPlanScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { addMeal, plannedMeals } = useMealPlanStore();

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

        {renderHorizontalSection("Most Popular", MOCK_RECIPES)}
        {renderHorizontalSection("Recently Created", MOCK_RECENT)}
        {renderHorizontalSection("Recommended Plan", MOCK_RECOMMENDED)}
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
