import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useUser } from "@clerk/clerk-expo";
import * as groceriesAPI from "../../services/groceriesAPI";
import { useRouter } from "expo-router";
import ShopOnlineModal from "../../components/modals/ShopOnlineModal";

const GroceriesScreen = () => {
  const { user } = useUser();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopOnlineVisible, setShopOnlineVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    fetchGroceries();
  }, [user?.id]);

  const fetchGroceries = async () => {
    if (!user) return;
    setLoading(true);
    const list = await groceriesAPI.getGroceries(user.id);
    setItems(list || []);
    setLoading(false);
  };

  const handleToggle = async (item) => {
    // Optimistic UI updates
    const newStatus = !item.isChecked;
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, isChecked: newStatus } : i));
    
    try {
      await groceriesAPI.toggleGroceryItem(item.id, newStatus);
    } catch {
      // Revert if failed
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, isChecked: !newStatus } : i));
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="basket-outline" size={80} color={COLORS.border} style={styles.icon} />
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.subtitle}>
        Add items from your meal plan to generate a smart shopping list automatically.
      </Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/meal-plan")}>
        <Text style={styles.actionButtonText}>Browse Meal Plans</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.groceryCard, item.isChecked && styles.groceryCardChecked]} 
      onPress={() => handleToggle(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, item.isChecked && styles.checkboxActive]}>
        {item.isChecked && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.isChecked && styles.itemTextStrikethrough]}>
          {item.ingredient}
        </Text>
        {item.measure && (
          <Text style={[styles.itemMeasure, item.isChecked && styles.itemTextStrikethrough]}>
            {item.measure}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAllergenWarning = () => {
    if (!showAlert) return null;
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertTitle}>Allergen Warning</Text>
        <Text style={styles.alertMessage}>
          Ingredients with a ⚠️ symbol may contain allergens. Tap an ingredient for more details, and make sure to purchase an allergen-free variety.
        </Text>
        <TouchableOpacity style={styles.alertButton} onPress={() => setShowAlert(false)}>
          <Text style={styles.alertButtonText}>Got It!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Groceries</Text>
          {items.length > 0 && (
            <Text style={styles.itemCount}>{items.filter(i => !i.isChecked).length} items left</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push("/add-grocery")}>
          <Ionicons name="add" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : items.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderAllergenWarning}
          />
          <View style={styles.stickyFooter}>
            <TouchableOpacity style={styles.shopOnlineButton} onPress={() => setShopOnlineVisible(true)}>
              <Text style={styles.shopOnlineButtonText}>Shop Online</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ShopOnlineModal visible={shopOnlineVisible} onClose={() => setShopOnlineVisible(false)} />
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
    alignItems: "baseline",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 28,
    color: COLORS.text,
  },
  itemCount: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listContent: {
    padding: 20,
  },
  groceryCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  groceryCardChecked: {
    opacity: 0.6,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  itemMeasure: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
  },
  itemTextStrikethrough: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
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
  alertContainer: {
    backgroundColor: "#F46252", // Red warning color from Figma
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  alertTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 8,
  },
  alertMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  alertButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#F46252",
  },
  stickyFooter: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shopOnlineButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  shopOnlineButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.white,
  },
});

export default GroceriesScreen;
