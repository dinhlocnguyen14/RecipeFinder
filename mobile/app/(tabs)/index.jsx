import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { homeStyles, recipeCardStyles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import { getRecipeStats } from "../../utils/recipeUtils";
import * as favoritesAPI from "../../services/favoritesAPI";
import * as mealAPI from "../../services/mealAPI";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

const RecipeCard = ({ item, onPress, isFavorite, toggleFavorite }) => {
  const stats = getRecipeStats(item.idMeal);
  
  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image source={{ uri: item.strMealThumb }} style={recipeCardStyles.image} />
        <TouchableOpacity 
          style={recipeCardStyles.favoriteIcon}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={18} 
            color={isFavorite ? COLORS.heart : COLORS.textLight} 
          />
        </TouchableOpacity>
      </View>
      <View style={recipeCardStyles.content}>
        <Text style={recipeCardStyles.title} numberOfLines={1}>
          {item.strMeal}
        </Text>
        <View style={recipeCardStyles.footer}>
          <View style={recipeCardStyles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
            <Text style={recipeCardStyles.metaText}>{stats.time} min</Text>
          </View>
          <View style={recipeCardStyles.metaItem}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={recipeCardStyles.metaText}>{stats.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Beef");
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [selectedCategory]);

  useEffect(() => {
    if (user) loadUserFavorites();
  }, [user]);

  const loadUserFavorites = async () => {
    const favorites = await favoritesAPI.getFavorites(user.id);
    setFavoriteIds(favorites.map(f => f.recipeId.toString()));
  };

  const loadInitialData = async () => {
    setLoading(true);
    const [cats, random] = await Promise.all([
      mealAPI.fetchCategories(),
      mealAPI.fetchRecipesByCategory("Seafood"),
    ]);
    setCategories(cats);
    if (random && random.length > 0) {
      setFeaturedRecipe(random[0]);
    }
  };

  const loadRecipes = async () => {
    setLoading(true);
    const data = await mealAPI.fetchRecipesByCategory(selectedCategory);
    setRecipes(data);
    setLoading(false);
  };

  const handleSearchPress = () => {
    router.push("/(tabs)/search");
  };

  const onRecipePress = (recipe) => {
    router.push(`/recipe/${recipe.idMeal}`);
  };

  const toggleFavorite = async (item) => {
    if (!user) return;

    const isFav = favoriteIds.includes(item.idMeal);
    try {
      if (isFav) {
        await favoritesAPI.removeFavorite(user.id, item.idMeal);
        setFavoriteIds(prev => prev.filter(id => id !== item.idMeal));
      } else {
        const stats = getRecipeStats(item.idMeal);
        await favoritesAPI.addFavorite({
          userId: user.id,
          recipeId: parseInt(item.idMeal),
          title: item.strMeal,
          image: item.strMealThumb,
          cookTime: `${stats.time} min`,
          servings: stats.servings.toString(),
        });
        setFavoriteIds(prev => [...prev, item.idMeal]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <View style={homeStyles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Welcome Section */}
      <View style={homeStyles.welcomeSection}>
        <View>
          <Text style={[homeStyles.welcomeText, { fontSize: 16, fontFamily: "Inter_400Regular", marginBottom: 4 }]}>
            Good Morning
          </Text>
          <Text style={homeStyles.welcomeText}>
            {user?.firstName || "Foodie"} 👩‍🍳
          </Text>
        </View>
        <TouchableOpacity 
          style={homeStyles.profileButton}
          onPress={() => router.push("/(tabs)/favorites")}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Search Bar (Navigates to Search Tab) */}
        <TouchableOpacity 
          style={homeStyles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <View style={homeStyles.searchBar}>
            <Ionicons name="search-outline" size={22} color={COLORS.textLight} />
            <Text style={homeStyles.searchPlaceholder}>Search any recipes...</Text>
          </View>
        </TouchableOpacity>

        {/* Featured Card */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity 
              style={homeStyles.featuredCard}
              onPress={() => onRecipePress(featuredRecipe)}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri: featuredRecipe.strMealThumb }} 
                style={homeStyles.featuredImage} 
              />
              <View style={homeStyles.featuredOverlay}>
                <View style={homeStyles.featuredTag}>
                  <Text style={homeStyles.featuredTagText}>Recipe of the day</Text>
                </View>
                <Text style={homeStyles.featuredTitle}>{featuredRecipe.strMeal}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <View style={homeStyles.categoryFilterContainer}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={homeStyles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.categoryFilterScrollContent}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.idCategory}
                onPress={() => setSelectedCategory(cat.strCategory)}
                style={[
                  homeStyles.categoryButton,
                  selectedCategory === cat.strCategory &&
                    homeStyles.selectedCategory,
                ]}
              >
                <Text
                  style={[
                    homeStyles.categoryText,
                    selectedCategory === cat.strCategory &&
                      homeStyles.selectedCategoryText,
                  ]}
                >
                  {cat.strCategory}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recipes Grid */}
        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>{selectedCategory} Recipes</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={homeStyles.recipesSection}>
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.idMeal}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={homeStyles.row}
                  renderItem={({ item }) => (
                    <RecipeCard 
                      item={item} 
                      onPress={onRecipePress} 
                      toggleFavorite={toggleFavorite}
                      isFavorite={favoriteIds.includes(item.idMeal)}
                    />
                  )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
