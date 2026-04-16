import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import * as groceriesAPI from "../services/groceriesAPI";

const COMMONLY_ADDED = [
  "bananas", "bread", "eggs", "apples", "milk", "almond milk", "fish", "chicken", "rice", "pasta", "butter", "cheese"
];

const AddGroceryScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [query, setQuery] = useState("");

  const filteredItems = COMMONLY_ADDED.filter(item => item.toLowerCase().includes(query.toLowerCase()));

  const handleAddItem = async (item) => {
    if (!user) return;
    try {
      // For manual additions, we use a pseudo recipeId of 0 or a generic manual id. 
      // Current groceriesAPI autoAddGroceries takes (userId, recipeId, list)
      await groceriesAPI.autoAddGroceries(user.id, 0, [{ ingredient: item, measure: "" }]);
      router.back();
    } catch (e) {
      console.error("Failed to add manual grocery item.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemRow} onPress={() => handleAddItem(item)}>
      <Ionicons name="add" size={20} color={COLORS.textLight} />
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cancelText}></Text>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Add something..."
            placeholderTextColor={COLORS.textLight}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>

        <FlatList
          data={query ? filteredItems : COMMONLY_ADDED}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            query && !COMMONLY_ADDED.includes(query.toLowerCase()) ? (
              <TouchableOpacity style={styles.itemRow} onPress={() => handleAddItem(query)}>
                <Ionicons name="add" size={20} color={COLORS.primary} />
                <Text style={[styles.itemText, { color: COLORS.primary }]}>Add "{query}" directly</Text>
              </TouchableOpacity>
            ) : null
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: COLORS.text,
  },
  cancelText: {
    width: 60,
  },
  cancelButton: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
});

export default AddGroceryScreen;
