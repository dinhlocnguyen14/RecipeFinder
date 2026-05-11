import { View, Text } from "react-native";
import { useRecipe } from "./_layout";
import { recipeDetailStyles } from "../../../assets/styles/recipe-detail.styles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

export default function IngredientsScreen() {
  const { recipe } = useRecipe();

  return (
    <View style={recipeDetailStyles.tabContent}>
      <View style={recipeDetailStyles.sectionContainer}>
        <View style={recipeDetailStyles.sectionTitleRow}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primary + "80"]}
            style={recipeDetailStyles.sectionIcon}
          >
            <Ionicons name="list" size={16} color={COLORS.white} />
          </LinearGradient>
          <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
          <View style={recipeDetailStyles.countBadge}>
            <Text style={recipeDetailStyles.countText}>
              {recipe.ingredients.length}
            </Text>
          </View>
        </View>

        <View style={recipeDetailStyles.ingredientsGrid}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={recipeDetailStyles.ingredientCard}>
              <View style={recipeDetailStyles.ingredientNumber}>
                <Text style={recipeDetailStyles.ingredientNumberText}>
                  {index + 1}
                </Text>
              </View>
              <Text style={recipeDetailStyles.ingredientText}>
                {ingredient}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
