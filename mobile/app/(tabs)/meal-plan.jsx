import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";

const MealPlanScreen = () => {
  const router = useRouter();
  const [showGuide, setShowGuide] = useState(false);

  const handleGotIt = () => {
    setShowGuide(false);
    router.push("/build-meal-plan");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal Plan</Text>
      </View>

      {/* Empty State Body */}
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

      {/* Guide Popover Bottom Sheet (Simulated with Modal) */}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: COLORS.text,
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
