import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import * as favoritesAPI from "../../services/favoritesAPI";

const FavoritesScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const data = await favoritesAPI.getFavorites(user.id);
    setFavorites(data || []);
    setLoading(false);
  };

  const renderFavoriteCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={() => router.push(`/recipe/${item.recipeId}`)}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        {/* Heart Icon Badge overlay for the favorite visual cue */}
        <View style={styles.heartBadge}>
          <Ionicons name="heart" size={16} color="#F46252" />
        </View>
      </View>
      <Text style={styles.recipeTitle} numberOfLines={3}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="heart-outline" size={80} color={COLORS.border} style={styles.icon} />
      <Text style={styles.title}>No favorites yet</Text>
      <Text style={styles.subtitle}>
        Tap the heart icon on recipes you love to save them here for later.
      </Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/")}>
        <Text style={styles.actionButtonText}>Discover Recipes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    color: COLORS.text,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: "48%", // For 2 column grid
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1, // Make it a perfect square
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: COLORS.background,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  heartBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  actionButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
    fontSize: 16,
  },
});

export default FavoritesScreen;
