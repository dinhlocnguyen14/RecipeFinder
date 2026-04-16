import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser, useClerk } from "@clerk/clerk-expo";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { recipeCardStyles } from "../../assets/styles/home.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as favoritesAPI from "../../services/favoritesAPI";
import { useRouter } from "expo-router";

const FavoriteCard = ({ item, onPress, onRemove }) => (
  <TouchableOpacity
    style={recipeCardStyles.container}
    onPress={() => onPress(item)}
    activeOpacity={0.9}
  >
    <View style={recipeCardStyles.imageContainer}>
      <Image source={{ uri: item.image }} style={recipeCardStyles.image} />
      <TouchableOpacity 
        style={recipeCardStyles.favoriteIcon}
        onPress={() => onRemove(item.recipeId)}
      >
        <Ionicons name="heart" size={18} color={COLORS.heart} />
      </TouchableOpacity>
    </View>
    <View style={recipeCardStyles.content}>
      <Text style={recipeCardStyles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={recipeCardStyles.footer}>
        <View style={recipeCardStyles.metaItem}>
          <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
          <Text style={recipeCardStyles.metaText}>{item.cookTime || "30 min"}</Text>
        </View>
        <View style={recipeCardStyles.metaItem}>
          <Ionicons name="flame-outline" size={14} color={COLORS.textLight} />
          <Text style={recipeCardStyles.metaText}>320 cal</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const FavoritesScreen = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await favoritesAPI.getFavorites(user.id);
    setFavorites(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleRemove = async (recipeId) => {
    const success = await favoritesAPI.removeFavorite(user.id, recipeId);
    if (success) {
      setFavorites(prev => prev.filter(fav => fav.recipeId !== recipeId));
    }
  };

  const onRecipePress = (fav) => {
    router.push(`/recipe/${fav.recipeId}`);
  };

  return (
    <View style={favoritesStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>My Taste</Text>
        <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={favoritesStyles.statsContainer}>
        <View style={favoritesStyles.statCard}>
          <View style={[favoritesStyles.statIcon, { backgroundColor: COLORS.primary + "15" }]}>
            <Ionicons name="heart" size={24} color={COLORS.primary} />
          </View>
          <Text style={favoritesStyles.statValue}>{favorites.length}</Text>
          <Text style={favoritesStyles.statLabel}>Favorites</Text>
        </View>
        <View style={favoritesStyles.statCard}>
          <View style={[favoritesStyles.statIcon, { backgroundColor: "#FFB800" + "15" }]}>
            <Ionicons name="star" size={24} color="#FFB800" />
          </View>
          <Text style={favoritesStyles.statValue}>4.8</Text>
          <Text style={favoritesStyles.statLabel}>Avg Rating</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={favoritesStyles.recipesSection}
          columnWrapperStyle={favoritesStyles.row}
          refreshing={loading}
          onRefresh={loadFavorites}
          renderItem={({ item }) => (
            <FavoriteCard item={item} onPress={onRecipePress} onRemove={handleRemove} />
          )}
          ListEmptyComponent={
            <View style={favoritesStyles.emptyState}>
              <View style={favoritesStyles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={64} color={COLORS.border} />
              </View>
              <Text style={favoritesStyles.emptyTitle}>Empty Plate?</Text>
              <Text style={favoritesStyles.emptySubtitle}>
                You haven't saved any recipes yet. Start exploring and find your favorite dishes!
              </Text>
              <TouchableOpacity 
                style={favoritesStyles.exploreButton}
                onPress={() => router.push("/(tabs)")}
              >
                <Text style={favoritesStyles.exploreButtonText}>Discover Recipes</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
