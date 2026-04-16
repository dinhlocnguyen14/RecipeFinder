import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import * as mealAPI from "../../services/mealAPI";

const MealPlanScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [showGuide, setShowGuide] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [user?.id]);

  const fetchPlans = async () => {
    if (!user) return;
    setLoading(true);
    const data = await mealAPI.getMealPlans(user.id);
    setPlans(data || []);
    setLoading(false);
  };

  const handleGotIt = () => {
    setShowGuide(false);
    router.push("/build-meal-plan");
  };

  const handleDelete = async (recipeId) => {
    try {
      await mealAPI.deleteMealPlan(user.id, recipeId);
      setPlans(plans.filter(p => p.recipeId !== recipeId));
    } catch (error) {
      Alert.alert("Error", "Could not remove meal plan.");
    }
  };

  const renderPlanCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.planCard} 
      onPress={() => router.push(`/recipe/${item.recipeId}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.planImage} />
      <View style={styles.planInfo}>
        <Text style={styles.planTitle} numberOfLines={2}>{item.title}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.recipeId)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={COLORS.error || "#FF3B30"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal Plan</Text>
        {plans.length > 0 && (
          <TouchableOpacity onPress={() => router.push("/build-meal-plan")}>
            <Ionicons name="add" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : plans.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.title}>Your personalized{"\n"}meal plan</Text>
          <Text style={styles.subtitle}>
            Plan your meals for the entire week in minutes. Build your first meal plan to get started!
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowGuide(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Build Your First Meal Plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plans}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Guide Popover Bottom Sheet */}
      <Modal
        visible={showGuide}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismissArea} onPress={() => setShowGuide(false)} />
          
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Build your first meal plan</Text>
              <TouchableOpacity onPress={() => setShowGuide(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sheetBodyText}>
              Add a few recipes to cook this week, and we'll build you an easy-to-shop grocery list.
            </Text>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={handleGotIt}
              activeOpacity={0.8}
            >
              <Text style={styles.sheetButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: COLORS.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 32,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  planImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  deleteButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalDismissArea: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: COLORS.text,
  },
  sheetBodyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    marginBottom: 32,
  },
  sheetButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  sheetButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
    fontSize: 16,
  },
});

export default MealPlanScreen;
