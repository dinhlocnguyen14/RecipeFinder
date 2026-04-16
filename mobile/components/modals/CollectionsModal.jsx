import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, TextInput, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

import { useUser } from "@clerk/clerk-expo";
import * as collectionsAPI from "../../services/collectionsAPI";

const CollectionsModal = ({ visible, onClose, onSave }) => {
  const { user } = useUser();
  const [view, setView] = useState("list"); // 'list' | 'add'
  const [collections, setCollections] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");

  React.useEffect(() => {
    if (visible && user) {
      loadCollections();
    }
  }, [visible, user]);

  const loadCollections = async () => {
    const data = await collectionsAPI.getCollections(user.id);
    setCollections(data);
  };

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCreateCollection = async () => {
    if (newCollectionName.trim() === "" || !user) return;
    try {
      const placeholderImage = "https://images.unsplash.com/photo-1495147466023-e6a920216b5a?w=200&q=80";
      const newCol = await collectionsAPI.createCollection(user.id, newCollectionName, placeholderImage);
      
      setCollections((prev) => [...prev, { ...newCol, count: 0 }]);
      setSelectedIds((prev) => [...prev, newCol.id]);
      setNewCollectionName("");
      setView("list");
    } catch (e) {
      console.error("Failed to create collection");
    }
  };

  const renderSelectionList = () => (
    <View style={styles.flexContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Select collections</Text>
        <Text style={styles.subtitle}>
          Create your own collections for quick access to all your favorites. Add your first collection to get started.
        </Text>

        {collections.map((col) => {
          const isSelected = selectedIds.includes(col.id);
          return (
            <TouchableOpacity 
              key={col.id} 
              style={[styles.collectionCard, isSelected && styles.collectionCardSelected]}
              onPress={() => toggleSelection(col.id)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: col.image }} style={styles.collectionImage} />
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionName}>{col.name}</Text>
                <Text style={styles.collectionCount}>{col.count} Recipes</Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addOutlineButton} onPress={() => setView("add")}>
          <Ionicons name="add" size={20} color={COLORS.text} />
          <Text style={styles.addOutlineText}>Add New Collection</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onSave(selectedIds)}>
          <Text style={styles.primaryButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddCollection = () => (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexContainer}>
      <View style={styles.scrollContent}>
        <Text style={styles.pageTitle}>Add a new collection</Text>
        
        <Text style={styles.label}>Collection's Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g. Vegetarian"
          placeholderTextColor={COLORS.textLight}
          value={newCollectionName}
          onChangeText={setNewCollectionName}
          autoFocus
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.primaryButton, !newCollectionName && styles.disabledButton]} 
          onPress={handleCreateCollection}
          disabled={!newCollectionName}
        >
          <Text style={styles.primaryButtonText}>Create Collection</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => view === "add" ? setView("list") : onClose()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          {view === "list" && (
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>

        {view === "list" ? renderSelectionList() : renderAddCollection()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 24,
  },
  pageTitle: {
    fontFamily: "Outfit_700Bold",
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 32,
  },
  collectionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  collectionCardSelected: {
    backgroundColor: "rgba(255, 140, 0, 0.1)",
    borderColor: COLORS.primary,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  collectionCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: COLORS.textLight,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.textLight,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  addOutlineButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    borderStyle: "dashed",
    marginTop: 8,
  },
  addOutlineText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  primaryButtonText: {
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
    fontSize: 16,
  },
});

export default CollectionsModal;
