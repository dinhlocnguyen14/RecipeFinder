import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const ShopOnlineModal = ({ visible, onClose }) => {
  const [showShortcut, setShowShortcut] = React.useState(true);

  const STORES = [
    { id: "asda", name: "Asda", icon: "basket", color: "#68A51C" },
    { id: "ocado", name: "Ocado", icon: "cart", color: "#3B2A58" },
    { id: "tesco", name: "Tesco", icon: "pricetag", color: "#00539F" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Shop Online</Text>
            <View style={styles.placeholderIcon} />
          </View>

          {/* Stores List */}
          <View style={styles.storesList}>
            {STORES.map((store) => (
              <TouchableOpacity key={store.id} style={styles.storeCard} activeOpacity={0.7} onPress={() => {}}>
                <View style={styles.storeLeft}>
                  <View style={[styles.storeIconWrapper, { backgroundColor: store.color }]}>
                     <Ionicons name={store.icon} size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.storeName}>{store.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.infoText}>Only showing stores available in your country.</Text>
          
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Show All Stores</Text>
          </TouchableOpacity>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>
                Access online shopping options quickly with a shortcut button on your grocery list.
              </Text>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Show online shopping shortcut</Text>
              <Switch 
                value={showShortcut} 
                onValueChange={setShowShortcut} 
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
            
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackText}>How can we make online shopping better for you?</Text>
              <TouchableOpacity style={styles.feedbackButton}>
                <Ionicons name="chatbubble-outline" size={18} color={COLORS.textLight} />
                <Text style={styles.feedbackActionText}>Give us feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  iconButton: {
    padding: 8,
  },
  placeholderIcon: {
    width: 40,
  },
  storesList: {
    marginTop: 16,
  },
  storeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  storeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  storeName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: COLORS.text,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginVertical: 20,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingVertical: 14,
    marginHorizontal: 24,
    alignItems: "center",
  },
  outlineButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
  settingsSection: {
    padding: 24,
    marginTop: 20,
  },
  settingsTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 12,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  switchLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
  },
  feedbackSection: {
    alignItems: "center",
    marginTop: 16,
  },
  feedbackText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackActionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
  },
});

export default ShopOnlineModal;
