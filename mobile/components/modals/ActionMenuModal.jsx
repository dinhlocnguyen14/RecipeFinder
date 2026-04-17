import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const ACTIONS = [
  { id: "nutrition", title: "Nutrition Facts", icon: "information-circle-outline" },
  { id: "mealPlan", title: "Add To Meal Plan", icon: "calendar-outline" },
  { id: "cookingMode", title: "Open Cooking Mode", icon: "restaurant-outline" },
  { id: "notes", title: "Add Notes", icon: "document-text-outline" },
  { id: "share", title: "Share", icon: "share-social-outline" },
  { id: "print", title: "Print", icon: "print-outline" },
  { id: "feedback", title: "Feedback For The Chef", icon: "chatbubble-ellipses-outline" },
  { id: "collections", title: "Add To Collections", icon: "folder-open-outline" },
];

const ActionMenuModal = ({ visible, onClose, onActionSelect }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.actionList}>
            {ACTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionRow}
                onPress={() => onActionSelect(item.id)}
              >
                <Ionicons name={item.icon} size={22} color={COLORS.text} style={styles.icon} />
                <Text style={styles.actionText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "80%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
    color: COLORS.text,
  },
  actionList: {
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  icon: {
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
  },
});

export default ActionMenuModal;
