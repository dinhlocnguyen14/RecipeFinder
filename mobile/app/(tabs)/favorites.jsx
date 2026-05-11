import { View, Text, FlatList } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

const FavoritesScreen = () => {
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        if (!user?.id) {
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/favorites/${user.id}`);
          if (!response.ok) throw new Error("Failed to fetch favorites");

          const favorites = await response.json();

          if (Array.isArray(favorites)) {
            // transform the data to match the RecipeCard component's expected format
            const transformedFavorites = favorites.map((favorite) => ({
              ...favorite,
              id: favorite.recipeId,
            }));

            setFavoriteRecipes(transformedFavorites);
          } else {
            setFavoriteRecipes([]);
          }
        } catch (error) {
          console.log("Error loading favorites", error);
        } finally {
          setLoading(false);
        }
      };

      loadFavorites();
    }, [user?.id]),
  );

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  const renderHeader = () => (
    <View style={favoritesStyles.header}>
      <View>
        <Text style={favoritesStyles.title}>Favorites</Text>
        <Text style={favoritesStyles.subtitle}>
          {favoriteRecipes.length}{" "}
          {favoriteRecipes.length === 1 ? "recipe" : "recipes"} saved
        </Text>
      </View>
      <View style={favoritesStyles.headerIconContainer}>
        <Ionicons name="heart" size={28} color={COLORS.primary} />
      </View>
    </View>
  );

  return (
    <View style={favoritesStyles.container}>
      <FlatList
        data={favoriteRecipes}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={favoritesStyles.row}
        contentContainerStyle={favoritesStyles.recipesGrid}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<NoFavoritesFound />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FavoritesScreen;
