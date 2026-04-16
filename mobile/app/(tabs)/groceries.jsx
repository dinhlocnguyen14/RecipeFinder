import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const GroceriesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groceries</Text>
      </View>

      <View style={styles.emptyStateContainer}>
        <Ionicons name="basket-outline" size={80} color={COLORS.border} style={styles.icon} />
        <Text style={styles.title}>Your cart is empty</Text>
        <Text style={styles.subtitle}>
          Add items from your meal plan to generate a smart shopping list automatically.
        </Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Browse Meal Plans</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 40,
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

export default GroceriesScreen;
