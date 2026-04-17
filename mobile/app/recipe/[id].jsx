import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  StatusBar,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { COLORS } from "../../constants/colors";
import * as mealAPI from "../../services/mealAPI";
import * as favoritesAPI from "../../services/favoritesAPI";
import * as collectionsAPI from "../../services/collectionsAPI";
import { useUser } from "@clerk/clerk-expo";
import { getRecipeStats } from "../../utils/recipeUtils";
import * as notesAPI from "../../services/notesAPI";
import ActionMenuModal from "../../components/modals/ActionMenuModal";
import FeedbackModal from "../../components/modals/FeedbackModal";
import CollectionsModal from "../../components/modals/CollectionsModal";
import NotesModal from "../../components/modals/NotesModal";

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeSegment, setActiveSegment] = useState("Ingredients");
  const [isCooked, setIsCooked] = useState(false);
  const [isPlanned, setIsPlanned] = useState(false);
  
  // Modal States
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [collectionsVisible, setCollectionsVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);
  
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    loadRecipeDetails();
    checkIfFavorite();
    checkIfPlanned();
    if (user?.id) loadExistingNote();
    setStats(getRecipeStats(id));
  }, [id, user?.id]);

  const loadExistingNote = async () => {
    try {
      const notesArray = await notesAPI.getNotes(user.id, id);
      if (notesArray && notesArray.length > 0) {
        setCurrentNote(notesArray[0].content);
      }
    } catch (error) {
      console.error("Failed to load note");
    }
  };

  const loadRecipeDetails = async () => {
    setLoading(true);
    const data = await mealAPI.fetchRecipeDetails(id);
    setRecipe(data);
    setLoading(false);
  };

  const checkIfFavorite = async () => {
    if (!user) return;
    const favorites = await favoritesAPI.getFavorites(user.id);
    const found = favorites.find((fav) => fav.recipeId === parseInt(id));
    setIsFavorite(!!found);
  };

  const checkIfPlanned = async () => {
    if (!user) return;
    const plans = await mealAPI.getMealPlans(user.id);
    const found = plans.find((p) => p.recipeId === parseInt(id));
    setIsPlanned(!!found);
  };

  const toggleMealPlan = async () => {
    if (!user) return Alert.alert("Sign In", "Please sign in to manage your meal plan.");

    try {
      if (isPlanned) {
        await mealAPI.deleteMealPlan(user.id, id);
        setIsPlanned(false);
        Alert.alert("Removed", "Recipe removed from your meal plan.");
      } else {
        await mealAPI.saveMealPlan(user.id, parseInt(id), recipe.strMeal, recipe.strMealThumb);
        setIsPlanned(true);

        // Auto-add ingredients to groceries
        const ingredients = getIngredients();
        if (ingredients.length > 0) {
          await groceriesAPI.autoAddGroceries(user.id, parseInt(id), ingredients);
          Alert.alert("Success", "Added to meal plan! Ingredients also added to your groceries list. 🛒");
        } else {
          Alert.alert("Success", "Added to meal plan! ✨");
        }
      }
    } catch (error) {
      console.error("Error toggling meal plan:", error);
      Alert.alert("Error", "Could not update meal plan.");
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      if (isFavorite) {
        await favoritesAPI.removeFavorite(user.id, id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.addFavorite({
          userId: user.id,
          recipeId: parseInt(id),
          title: recipe.strMeal,
          image: recipe.strMealThumb,
          cookTime: "30 min",
          servings: "2",
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.strMeal}\n${recipe.strSource || ""}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const getIngredients = () => {
    const ingredients = [];
    if (!recipe) return ingredients;
    for (let i = 1; i <= 20; i++) {
      if (recipe[`strIngredient${i}`]) {
        ingredients.push({
          ingredient: recipe[`strIngredient${i}`],
          measure: recipe[`strMeasure${i}`],
        });
      }
    }
    return ingredients;
  };

  const handleStartCooking = () => {
    router.push({ pathname: "/cooking-mode", params: { id } });
  };

  const handleActionSelect = (actionId) => {
    setActionMenuVisible(false);
    // Add brief delay to avoid modal overlap glitch
    setTimeout(() => {
      if (actionId === "feedback") setFeedbackVisible(true);
      else if (actionId === "collections") setCollectionsVisible(true);
      else if (actionId === "notes") setNotesVisible(true);
      else if (actionId === "mealPlan") toggleMealPlan();
      else if (actionId === "share") onShare();
      else if (actionId === "cookingMode") handleStartCooking();
    }, 300);
  };

  if (loading || !recipe || !stats) {
    return (
      <View style={[recipeDetailStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={recipeDetailStyles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={recipeDetailStyles.headerContainer}>
          <Image 
            source={{ uri: recipe.strMealThumb }} 
            style={recipeDetailStyles.headerImage}
            contentFit="cover"
            transition={300}
          />
          
          {/* Floating Buttons */}
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity 
              style={recipeDetailStyles.floatingButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={recipeDetailStyles.floatingButton} onPress={() => setActionMenuVisible(true)}>
              <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Title Info */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>{recipe.strCategory}</Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.strMeal}</Text>
            <View style={recipeDetailStyles.locationRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.white} />
              <Text style={recipeDetailStyles.locationText}>{recipe.strArea}</Text>
            </View>
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* Stats Chips */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <Ionicons name="time-outline" size={24} color={COLORS.primary} />
              <Text style={recipeDetailStyles.statValue}>{stats.time}</Text>
              <Text style={recipeDetailStyles.statLabel}>Mins</Text>
            </View>
            <View style={recipeDetailStyles.statCard}>
              <Ionicons name="restaurant-outline" size={24} color={COLORS.primary} />
              <Text style={recipeDetailStyles.statValue}>{stats.servings}</Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
            <View style={recipeDetailStyles.statCard}>
              <Ionicons name="flame-outline" size={24} color={COLORS.primary} />
              <Text style={recipeDetailStyles.statValue}>{stats.calories}</Text>
              <Text style={recipeDetailStyles.statLabel}>Cal</Text>
            </View>
          </View>

          {/* Segmented Control */}
          <View style={recipeDetailStyles.segmentContainer}>
            {["Cookware", "Ingredients", "Instructions"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  recipeDetailStyles.segmentButton,
                  activeSegment === tab && recipeDetailStyles.segmentButtonActive
                ]}
                onPress={() => setActiveSegment(tab)}
              >
                <Text style={[
                  recipeDetailStyles.segmentText,
                  activeSegment === tab && recipeDetailStyles.segmentTextActive
                ]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dynamic Segment Content */}
          {activeSegment === "Cookware" && (
            <View style={recipeDetailStyles.sectionContainer}>
              <Text style={recipeDetailStyles.instructionText}>
                • Large Skillet or Pan{"\n"}• Cutting Board{"\n"}• Chef's Knife{"\n"}• Measuring Spoons{"\n"}• Serving Bowls
              </Text>
            </View>
          )}

          {activeSegment === "Ingredients" && (
            <View style={recipeDetailStyles.sectionContainer}>
              {getIngredients().map((item, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <Text style={recipeDetailStyles.ingredientName}>{item.ingredient}</Text>
                  <Text style={recipeDetailStyles.ingredientMeasure}>{item.measure}</Text>
                </View>
              ))}
            </View>
          )}

          {activeSegment === "Instructions" && (
            <View style={recipeDetailStyles.sectionContainer}>
              <Text style={recipeDetailStyles.instructionText}>
                {recipe.strInstructions}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Segmented Footer */}
      <View style={recipeDetailStyles.stickyFooter}>
        <TouchableOpacity 
          style={recipeDetailStyles.cookedCheckbox}
          onPress={() => setIsCooked(!isCooked)}
        >
          <View style={[
            recipeDetailStyles.checkboxCircle,
            isCooked && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
          ]}>
            {isCooked && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
          </View>
          <Text style={recipeDetailStyles.cookedText}>Cooked?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={recipeDetailStyles.startCookingButton}
          onPress={handleStartCooking}
        >
          <Text style={recipeDetailStyles.startCookingText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>

      {/* Modals Ecosystem */}
      <ActionMenuModal 
        visible={actionMenuVisible} 
        onClose={() => setActionMenuVisible(false)} 
        onActionSelect={handleActionSelect} 
      />
      <FeedbackModal 
        visible={feedbackVisible} 
        onClose={() => setFeedbackVisible(false)} 
        onSubmit={(data) => {
          setFeedbackVisible(false);
          // In a real app, send to API, here we just alert (toast fallback)
          Alert.alert("Feedback Received. Thanks!");
        }}
      />
      <CollectionsModal 
        visible={collectionsVisible} 
        onClose={() => setCollectionsVisible(false)} 
        onSave={async (selectedIds) => {
          setCollectionsVisible(false);
          try {
            await Promise.all(
              selectedIds.map((colId) => 
                collectionsAPI.addRecipeToCollection(colId, id, recipe.strMeal, recipe.strMealThumb)
              )
            );
            Alert.alert("Success", "Recipe magically added to collections! ✨");
          } catch (e) {
            Alert.alert("Error", "Could not add to collections.");
          }
        }}
      />
      <NotesModal 
        visible={notesVisible} 
        onClose={() => setNotesVisible(false)} 
        initialNote={currentNote}
        onSave={async (newNote) => {
          if (!user) return Alert.alert("Error", "Please sign in to save notes.");
          try {
            await notesAPI.saveNote(user.id, id, newNote);
            setCurrentNote(newNote); // update UI
            Alert.alert("Success", "Note saved securely! 📝");
          } catch (error) {
            Alert.alert("Error", "Could not save your note.");
          }
        }}
      />
    </View>
  );
};

export default RecipeDetailScreen;
