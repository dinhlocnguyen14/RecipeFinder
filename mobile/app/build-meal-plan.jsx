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
import { useMealPlanStore } from "../store/useMealPlanStore";

// Dummy Data
const MOCK_RECIPES = [
  {
    id: "r1",
    title: "Brussels Sprouts, Mashed Potato & Sausage Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    time: "35 min",
  },
  {
    id: "r2",
    title: "Roasted Cauliflower & Black Bean Burrito Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    time: "40 min",
  },
  {
    id: "r3",
    title: "Creamy Cashew & Zucchini Noodles",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
    time: "20 min",
  },
];

const MOCK_RECENT = [
  {
    id: "r4",
    title: "Indian Butter Chicken with Basmati Rice",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
    time: "50 min",
  },
  {
    id: "r5",
    title: "Greek Salad with Feta Cheese & Olives",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
    time: "15 min",
  },
];

const MOCK_RECOMMENDED = [
  {
    id: "r6",
    title: "Spicy Tofu Stir Fry with Mixed Veggies",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c152?w=400&q=80",
    time: "25 min",
  },
  {
    id: "r7",
    title: "Grilled Salmon with Lemon Butter Sauce",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    time: "30 min",
  },
];

const BuildMealPlanScreen = () => {
  const router = useRouter();
  const { addMeal, plannedMeals } = useMealPlanStore();

  const handleAddToPlan = (recipe) => {
    addMeal(recipe);
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
