import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { searchStyles } from "../../assets/styles/search.styles";
import { recipeCardStyles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import * as mealAPI from "../../services/mealAPI";
import { useRouter } from "expo-router";

const RecipeCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={recipeCardStyles.container}
    onPress={() => onPress(item)}
    activeOpacity={0.9}
  >
    <View style={recipeCardStyles.imageContainer}>
      <Image source={{ uri: item.strMealThumb }} style={recipeCardStyles.image} />
    </View>
    <View style={recipeCardStyles.content}>
      <Text style={recipeCardStyles.title} numberOfLines={1}>
        {item.strMeal}
      </Text>
      <View style={recipeCardStyles.footer}>
        <View style={recipeCardStyles.metaItem}>
          <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
          <Text style={recipeCardStyles.metaText}>25 min</Text>
        </View>
        <View style={recipeCardStyles.metaItem}>
          <Ionicons name="star" size={14} color="#FFB800" />
          <Text style={recipeCardStyles.metaText}>4.8</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// We need Image from react-native locally here since it's used in RecipeCard
import { Image } from "react-native";

const SearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await mealAPI.searchRecipes(searchQuery);
      setResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onRecipePress = (recipe) => {
    router.push(`/recipe/${recipe.idMeal}`);
  };

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.header}>
        <Text style={searchStyles.title}>Search</Text>
        <View style={searchStyles.searchBarContainer}>
          <Ionicons name="search-outline" size={22} color={COLORS.textLight} />
          <TextInput
            placeholder="Search any recipes..."
            style={searchStyles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : hasSearched ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            contentContainerStyle={searchStyles.content}
            columnWrapperStyle={searchStyles.row}
            renderItem={({ item }) => (
              <RecipeCard item={item} onPress={onRecipePress} />
            )}
            ListHeaderComponent={
              <Text style={searchStyles.resultsCount}>
                Found {results.length} results
              </Text>
            }
            ListEmptyComponent={
              <View style={searchStyles.emptyState}>
                <Ionicons name="search-outline" size={64} color={COLORS.border} />
                <Text style={searchStyles.emptyTitle}>No Results Found</Text>
                <Text style={searchStyles.emptySubtitle}>
                  Try searching for something else, like "Chicken" or "Pasta".
                </Text>
              </View>
            }
          />
        ) : (
          <View style={searchStyles.content}>
            <Text style={searchStyles.sectionTitle}>Popular Searches</Text>
            <View style={searchStyles.historyContainer}>
              {["Chicken", "Pasta", "Soup", "Salad", "Beef", "Dessert"].map((item) => (
                <TouchableOpacity 
                  key={item} 
                  style={searchStyles.historyItem}
                  onPress={() => {
                    setSearchQuery(item);
                    // Trigger search after state update
                    setTimeout(handleSearch, 100);
                  }}
                >
                  <Text style={searchStyles.historyText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
