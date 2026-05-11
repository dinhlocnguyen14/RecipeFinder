import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useMemo } from "react";
import { useRecipe } from "./_layout";
import { recipeDetailStyles } from "../../../assets/styles/recipe-detail.styles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { WebView } from "react-native-webview";

export default function OverviewScreen() {
  const { recipe } = useRecipe();
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = useMemo(() => {
    if (!recipe?.youtubeUrl) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = recipe.youtubeUrl.match(regex);
    return match ? match[1] : null;
  }, [recipe?.youtubeUrl]);

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  return (
    <View style={recipeDetailStyles.tabContent}>
      {/* QUICK STATS */}
      <View style={recipeDetailStyles.statsContainer}>
        <View style={recipeDetailStyles.statCard}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E53"]}
            style={recipeDetailStyles.statIconContainer}
          >
            <Ionicons name="time" size={20} color={COLORS.white} />
          </LinearGradient>
          <Text style={recipeDetailStyles.statValue}>{recipe.cookTime}</Text>
          <Text style={recipeDetailStyles.statLabel}>Prep Times</Text>
        </View>

        <View style={recipeDetailStyles.statCard}>
          <LinearGradient
            colors={["#4ECDC4", "#44A08D"]}
            style={recipeDetailStyles.statIconContainer}
          >
            <Ionicons name="people" size={20} color={COLORS.white} />
          </LinearGradient>
          <Text style={recipeDetailStyles.statValue}>{recipe.servings}</Text>
          <Text style={recipeDetailStyles.statLabel}>Servings</Text>
        </View>
      </View>

      {recipe.youtubeUrl && embedUrl ? (
        <View style={recipeDetailStyles.sectionContainer}>
          <View style={recipeDetailStyles.sectionTitleRow}>
            <LinearGradient
              colors={["#FF0000", "#CC0000"]}
              style={recipeDetailStyles.sectionIcon}
            >
              <Ionicons name="play" size={16} color={COLORS.white} />
            </LinearGradient>
            <Text style={recipeDetailStyles.sectionTitle}>Video Tutorial</Text>
          </View>

          <View style={recipeDetailStyles.videoCard}>
            {isPlaying ? (
              <WebView
                style={recipeDetailStyles.webview}
                source={{
                  uri: `${embedUrl}?autoplay=1&modestbranding=1&rel=0&hl=vi`,
                }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={["*"]}
                userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
                startInLoadingState={true}
                renderLoading={() => (
                  <View
                    style={[
                      recipeDetailStyles.webview,
                      {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000",
                      },
                    ]}
                  >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                )}
              />
            ) : (
              <TouchableOpacity
                style={recipeDetailStyles.thumbnailContainer}
                activeOpacity={0.9}
                onPress={() => setIsPlaying(true)}
              >
                {thumbnailUrl && (
                  <Image
                    source={{ uri: thumbnailUrl }}
                    style={recipeDetailStyles.thumbnailImage}
                    resizeMode="cover"
                  />
                )}
                <LinearGradient
                  colors={["rgba(0,0,0,0.3)", "transparent", "rgba(0,0,0,0.5)"]}
                  style={StyleSheet.absoluteFill}
                />
                <View style={recipeDetailStyles.playButtonOverlay}>
                  <Ionicons
                    name="play"
                    size={40}
                    color={COLORS.white}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : recipe.youtubeUrl ? (
        <View style={recipeDetailStyles.sectionContainer}>
          <Text style={{ color: COLORS.textLight }}>
            Invalid YouTube link: {recipe.youtubeUrl}
          </Text>
        </View>
      ) : null}

      {recipe.area && (
        <View style={recipeDetailStyles.sectionContainer}>
          <View style={recipeDetailStyles.sectionTitleRow}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"]}
              style={recipeDetailStyles.sectionIcon}
            >
              <Ionicons name="globe" size={16} color={COLORS.white} />
            </LinearGradient>
            <Text style={recipeDetailStyles.sectionTitle}>Cuisine Area</Text>
          </View>
          <Text style={[recipeDetailStyles.instructionText, { fontSize: 18 }]}>
            This is a classic {recipe.area} dish.
          </Text>
        </View>
      )}
    </View>
  );
}
